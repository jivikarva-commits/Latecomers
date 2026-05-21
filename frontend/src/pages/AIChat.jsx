import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { ArrowLeft, Bot, History, Mic, MoreVertical, Plus, Send } from "lucide-react";

const generationSteps = ["Understanding your question", "Finding the useful details", "Organizing a clear answer"];

function TypingDots() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % generationSteps.length);
    }, 1300);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-line rounded-2xl rounded-tl-sm px-4 py-3 min-w-[230px]">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="text-xs font-semibold text-muted2 ml-2">{generationSteps[step]}</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-brand-50">
        <span className="chat-progress-bar" />
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="w-9 h-9 rounded-full cc-logo-gradient flex items-center justify-center text-white shrink-0">
      <Bot size={16} />
    </div>
  );
}

function cleanInlineMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();
}

function parseAssistantContent(content) {
  const blocks = [];
  const lines = (content || "").split(/\r?\n/);
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line || /^-{3,}$/.test(line)) {
      flushList();
      return;
    }

    const headingMatch = line.match(/^#{1,6}\s*(.+)$/);
    if (headingMatch) {
      flushList();
      blocks.push({ type: "heading", text: cleanInlineMarkdown(headingMatch[1]) });
      return;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      listItems.push(cleanInlineMarkdown(bulletMatch[1]));
      return;
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (numberedMatch) {
      listItems.push(cleanInlineMarkdown(numberedMatch[1]));
      return;
    }

    flushList();
    blocks.push({ type: "paragraph", text: cleanInlineMarkdown(line) });
  });

  flushList();
  return blocks;
}

function AssistantMessage({ content, streaming = false }) {
  const blocks = parseAssistantContent(content);

  if (!blocks.length && streaming) {
    return (
      <div className="flex items-center gap-1.5 py-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    );
  }

  return (
    <div className="assistant-response">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={index} className="assistant-heading">
              {block.text}
            </h2>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="assistant-list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{block.text}</p>;
      })}
      {streaming && <span className="typing-caret" aria-hidden="true" />}
    </div>
  );
}

function buildInitialMessage(careerContext) {
  if (!careerContext?.careerTitle) {
    return {
      role: "assistant",
      content: "Hi! I'm your AI career assistant. Ask me about skills, roadmaps, jobs, internships, scholarships, or tools.",
      suggestions: [
        "What skills should I focus on for the next 3 months?",
        "Suggest a project plan for my target role",
        "How should I prepare for placements?",
        "Top scholarships I can apply for",
      ],
      timestamp: new Date().toISOString(),
    };
  }

  const focusText = careerContext.careerFocus ? ` I can help with ${careerContext.careerFocus}, or anything else about this path.` : "";
  return {
    role: "assistant",
    content: `You're asking about ${careerContext.careerTitle}. I have this career context loaded, including skills, jobs, salary range, demand, and roadmap basics.${focusText}`,
    suggestions: [
      `What should I learn for ${careerContext.careerTitle}?`,
      "Which jobs can I target first?",
      "Make a 3-month action plan",
      "Which projects should I build?",
    ],
    timestamp: new Date().toISOString(),
  };
}

export default function AIChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const endRef = useRef(null);
  const revealTimerRef = useRef(null);
  const careerContext = useMemo(() => location.state || null, [location.state]);

  const [messages, setMessages] = useState([buildInitialMessage(careerContext)]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const responseStreaming = messages.some((message) => message.streaming);
  const isGenerating = busy || responseStreaming;
  const careerContextKey = `${careerContext?.careerSlug || "general"}:${careerContext?.careerFocus || ""}`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  useEffect(() => {
    setChatId(null);
    setMessages([buildInitialMessage(careerContext)]);
  }, [careerContextKey, careerContext]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, []);

  const revealAssistantReply = (reply, suggestions) => {
    const messageId = `assistant-${Date.now()}`;
    const cleanReply = (reply || "").trim();
    let cursor = 0;

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: "assistant",
        content: "",
        suggestions: [],
        timestamp: new Date().toISOString(),
        streaming: true,
      },
    ]);

    const tick = () => {
      cursor = Math.min(cursor + 14, cleanReply.length);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: cleanReply.slice(0, cursor),
                suggestions: cursor >= cleanReply.length ? suggestions || [] : [],
                streaming: cursor < cleanReply.length,
              }
            : message
        )
      );

      if (cursor < cleanReply.length) {
        const nextChar = cleanReply[cursor] || "";
        const delay = nextChar === "\n" ? 90 : 22;
        revealTimerRef.current = window.setTimeout(tick, delay);
      }
    };

    revealTimerRef.current = window.setTimeout(tick, 120);
  };

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || isGenerating) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message, timestamp: new Date().toISOString() }]);
    setBusy(true);

    try {
      const requestPayload = { message, chat_id: chatId };
      if (careerContext?.careerSlug) {
        requestPayload.career_slug = careerContext.careerSlug;
        requestPayload.message = [
          `Career context: ${careerContext.careerTitle}`,
          careerContext.careerDescription ? `Description: ${careerContext.careerDescription}` : "",
          careerContext.careerOverview ? `Overview: ${careerContext.careerOverview}` : "",
          careerContext.careerStats ? `Stats: ${JSON.stringify(careerContext.careerStats)}` : "",
          careerContext.careerSkills?.length ? `Skills: ${careerContext.careerSkills.join(", ")}` : "",
          careerContext.careerJobs?.length ? `Job roles: ${careerContext.careerJobs.join(", ")}` : "",
          careerContext.careerFullContext ? `Full career context JSON: ${JSON.stringify(careerContext.careerFullContext)}` : "",
          `Student question: ${message}`,
        ].filter(Boolean).join("\n");
      }

      const { data } = await api.post("/ai/chat", requestPayload);
      setChatId(data.chat_id);
      setBusy(false);
      revealAssistantReply(data.reply, data.suggestions || []);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error?.response?.data?.detail || "I hit an error while responding. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
      setBusy(false);
    }
  };

  return (
    <div className="h-[100dvh] md:h-screen p-0 md:p-4 lg:p-6" data-testid="ai-chat-page">
      <div className="h-full max-w-5xl mx-auto glass-card md:rounded-3xl md:overflow-hidden flex flex-col">
        <div className="bg-white/95 border-b border-line px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-ink" data-testid="chat-back-button">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-base sm:text-lg text-ink">AI Chat</h1>
            <p className="text-xs text-muted2">
              {careerContext?.careerTitle ? `Career context: ${careerContext.careerTitle}` : "Your career companion powered by AI"}
            </p>
          </div>
          <button className="p-2 text-muted2" data-testid="chat-history-button"><History size={20} /></button>
          <button className="p-2 text-muted2"><MoreVertical size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 bg-brand-50/45">
          <div className="max-w-3xl mx-auto space-y-4" data-testid="chat-messages">
            {messages.map((message, index) => (
              <div key={message.id || index} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "items-start"}`}>
                {message.role === "assistant" && <AssistantAvatar />}

                <div className={message.role === "user" ? "max-w-[88%]" : "max-w-[90%] flex-1"}>
                  <div
                    className={
                      message.role === "user"
                        ? "bg-brand text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm sm:text-[15px]"
                        : "bg-white border border-line rounded-2xl rounded-tl-sm px-4 py-3 text-sm sm:text-[15px]"
                    }
                    data-testid={`msg-${message.role}-${index}`}
                  >
                    {message.role === "assistant" ? (
                      <AssistantMessage content={message.content} streaming={message.streaming} />
                    ) : (
                      message.content
                    )}
                  </div>

                  <p className={`text-[10px] text-muted2 mt-1 ${message.role === "user" ? "text-right pr-1" : ""}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>

                  {message.role === "assistant" && message.suggestions?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2" data-testid={`suggestions-${index}`}>
                      {message.suggestions.slice(0, 4).map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => send(suggestion)}
                          disabled={isGenerating}
                          className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-semibold text-brand hover:bg-brand-50"
                          data-testid={`suggestion-${index}-${idx}`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex items-start gap-2">
                <AssistantAvatar />
                <TypingDots />
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="bg-white border-t border-line px-3 sm:px-5 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <button className="p-2.5 rounded-full bg-brand-50 text-brand" data-testid="chat-plus-button">
              <Plus size={18} />
            </button>
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={careerContext?.careerTitle ? `Ask anything about ${careerContext.careerTitle}...` : "Ask anything about your career..."}
                className="w-full bg-brand-50 border border-brand-100 rounded-full pl-4 pr-12 py-3 text-sm sm:text-[15px] placeholder:text-muted2"
                data-testid="chat-input"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted2">
                <Mic size={16} />
              </button>
            </div>
            <button
              onClick={() => send()}
              disabled={!input.trim() || isGenerating}
              className="p-3 rounded-full bg-brand text-white disabled:opacity-50"
              data-testid="chat-send-button"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
