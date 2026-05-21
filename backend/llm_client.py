"""
Unified LLM client for LATE COMERS AI.
Uses AWS Bedrock direct HTTP when AWS_BEARER_TOKEN_BEDROCK is set,
otherwise falls back to Emergent LLM key via emergentintegrations.
"""
import os
import json
import logging
import asyncio
import re
from typing import List, Dict, Optional

import httpx

logger = logging.getLogger(__name__)

AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
AWS_BEARER_TOKEN = os.environ.get("AWS_BEARER_TOKEN_BEDROCK", "").strip()
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "").strip()
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "").strip()
BEDROCK_RUNTIME_ENDPOINT = os.environ.get(
    "BEDROCK_RUNTIME_ENDPOINT",
    f"https://bedrock-runtime.{AWS_REGION}.amazonaws.com",
).rstrip("/")
BEDROCK_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "global.anthropic.claude-sonnet-4-5-20250929-v1:0")
BEDROCK_TIMEOUT_SECONDS = float(os.environ.get("BEDROCK_TIMEOUT_SECONDS", "120"))
BEDROCK_SSL_VERIFY = os.environ.get("BEDROCK_SSL_VERIFY", "true").strip().lower() != "false"
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "").strip()


def _provider() -> str:
    if AWS_BEARER_TOKEN or (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY):
        return "bedrock"
    if EMERGENT_LLM_KEY:
        return "emergent"
    return "none"


async def ask_claude(
    user_prompt: str,
    system_prompt: str = "You are Late Comers AI, a friendly, India-specific career counselor for students. Be concise, encouraging, and actionable.",
    max_tokens: int = 2048,
    json_only: bool = False,
    history: Optional[List[Dict[str, str]]] = None,
) -> str:
    """
    Send a prompt to Claude Sonnet 4.5 and return the text response.
    history: list of {"role": "user"|"assistant", "content": "..."}
    """
    provider = _provider()
    if provider == "none":
        raise RuntimeError(
            "No LLM credentials configured. Set AWS_BEARER_TOKEN_BEDROCK or EMERGENT_LLM_KEY in /app/backend/.env"
        )

    full_system = system_prompt
    if json_only:
        full_system += "\n\nCRITICAL: Respond with ONLY valid JSON. No markdown fences, no commentary, no preamble."

    if provider == "bedrock":
        return await _ask_bedrock(user_prompt, full_system, max_tokens, history)
    return await _ask_emergent(user_prompt, full_system, max_tokens, history)


async def _ask_bedrock(user_prompt, system_prompt, max_tokens, history):
    messages = []
    if history:
        for m in history:
            messages.append({"role": m["role"], "content": [{"type": "text", "text": m["content"]}]})
    messages.append({"role": "user", "content": [{"type": "text", "text": user_prompt}]})

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "system": system_prompt,
        "messages": messages,
    }

    return await _invoke_bedrock_http(body)


def _bedrock_headers() -> Dict[str, str]:
    if not AWS_BEARER_TOKEN:
        raise RuntimeError("AWS_BEARER_TOKEN_BEDROCK is required for direct Bedrock API access")
    return {
        "Authorization": f"Bearer {AWS_BEARER_TOKEN}",
        "x-api-key": AWS_BEARER_TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


async def _invoke_bedrock_http(body: Dict) -> str:
    url = f"{BEDROCK_RUNTIME_ENDPOINT}/model/{BEDROCK_MODEL_ID}/invoke"
    logger.info("[bedrock] POST %s", url)
    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(BEDROCK_TIMEOUT_SECONDS, connect=15.0),
            verify=BEDROCK_SSL_VERIFY,
            follow_redirects=True,
        ) as client:
            resp = await client.post(url, headers=_bedrock_headers(), json=body)
    except httpx.TimeoutException as exc:
        raise RuntimeError(f"Bedrock request timed out after {BEDROCK_TIMEOUT_SECONDS}s") from exc
    except httpx.HTTPError as exc:
        raise RuntimeError(f"Bedrock HTTP error: {exc}") from exc

    logger.info("[bedrock] status=%s body=%s", resp.status_code, resp.text[:300])
    if resp.status_code >= 400:
        raise RuntimeError(f"Bedrock API error {resp.status_code}: {resp.text[:500]}")

    result = resp.json()
    parts = []
    for item in result.get("content", []):
        if item.get("type") == "text" and item.get("text"):
            parts.append(item["text"])
    text = "\n".join(parts).strip()
    if not text:
        raise RuntimeError("Bedrock returned an empty response")
    return text


async def ask_bedrock_with_web_search(
    user_prompt: str,
    system_prompt: str,
    max_tokens: int = 4096,
    max_searches: int = 8,
) -> str:
    """Call Claude on Bedrock with Anthropic's web search server tool enabled."""
    if not AWS_BEARER_TOKEN:
        raise RuntimeError("AWS_BEARER_TOKEN_BEDROCK is required for Bedrock web search")

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": user_prompt}],
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": max_searches,
            }
        ],
    }
    return await _invoke_bedrock_http(body)


async def _ask_emergent(user_prompt, system_prompt, max_tokens, history):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    import uuid

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=str(uuid.uuid4()),
        system_message=system_prompt,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929").with_params(max_tokens=max_tokens)

    # Prepend history by including in system context (emergent doesn't expose history directly per call)
    composed = user_prompt
    if history:
        hist_text = "\n\n[Previous conversation]\n"
        for m in history[-6:]:
            hist_text += f"{m['role'].upper()}: {m['content']}\n"
        composed = hist_text + "\n[Current message]\n" + user_prompt

    msg = UserMessage(text=composed)
    response = await chat.send_message(msg)
    return response if isinstance(response, str) else str(response)


def extract_json(text: str) -> dict:
    """Extract a JSON object from Claude text, tolerating fences and common LLM JSON slips."""
    raw = (text or "").strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)```", raw, re.DOTALL | re.IGNORECASE)
    if fenced:
        raw = fenced.group(1).strip()

    candidate = _first_json_object(raw)
    attempts = [
        candidate,
        _clean_json(candidate),
        _escape_newlines_inside_strings(_clean_json(candidate)),
    ]
    last_error = None
    for value in attempts:
        try:
            return json.loads(value)
        except json.JSONDecodeError as exc:
            last_error = exc
    raise last_error


def _first_json_object(text: str) -> str:
    start = text.find("{")
    if start == -1:
        return text.strip()

    in_string = False
    escaped = False
    depth = 0
    for idx in range(start, len(text)):
        ch = text[idx]
        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : idx + 1].strip()
    return text[start:].strip()


def _clean_json(text: str) -> str:
    cleaned = text.strip().lstrip("\ufeff")
    cleaned = cleaned.replace("“", '"').replace("”", '"').replace("’", "'")
    cleaned = re.sub(r",\s*([}\]])", r"\1", cleaned)
    cleaned = re.sub(r"\bNone\b", "null", cleaned)
    cleaned = re.sub(r"\bTrue\b", "true", cleaned)
    cleaned = re.sub(r"\bFalse\b", "false", cleaned)
    return cleaned


def _escape_newlines_inside_strings(text: str) -> str:
    out = []
    in_string = False
    escaped = False
    for ch in text:
        if in_string:
            if escaped:
                out.append(ch)
                escaped = False
                continue
            if ch == "\\":
                out.append(ch)
                escaped = True
                continue
            if ch == '"':
                in_string = False
                out.append(ch)
                continue
            if ch == "\n":
                out.append("\\n")
                continue
            if ch == "\r":
                continue
            if ch == "\t":
                out.append("\\t")
                continue
            out.append(ch)
            continue
        if ch == '"':
            in_string = True
        out.append(ch)
    return "".join(out)


def llm_status() -> dict:
    return {
        "provider": _provider(),
        "model": BEDROCK_MODEL_ID if _provider() == "bedrock" else "claude-sonnet-4-5 (via Emergent)",
        "bedrock_configured": bool(AWS_BEARER_TOKEN or (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)),
        "emergent_configured": bool(EMERGENT_LLM_KEY),
    }
