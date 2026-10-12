"""Small helpers for the detailed government guides (same shape as the IAS/IPS/IFS guides).

Every detailed guide returns a dict rendered by frontend CivilServiceGuide.jsx. Only
service, quickFacts, role, eligibility, examStages, passingRules, steps, prepPlan,
freeResources, mistakes, faqs and related are required; the rest are optional.
"""


def step(title, when, detail):
    return {"title": title, "when": when, "detail": detail}


def stage(name, when, purpose, papers, pass_rule):
    return {"name": name, "when": when, "purpose": purpose, "papers": papers, "passRule": pass_rule}


def paper(name, marks, duration, counts):
    return {"paper": name, "marks": marks, "duration": duration, "counts": counts}


def fact(label, value):
    return {"label": label, "value": value}


def institute(name, type_, url, covers, best_for, mode=None, duration=None, fee=None, eligibility=None):
    return {"name": name, "type": type_, "url": url, "covers": covers, "bestFor": best_for,
            "mode": mode, "duration": duration, "fee": fee, "eligibility": eligibility}


def source(label, url, scope, kind="official"):
    return {"label": label, "url": url, "scope": scope, "kind": kind}


def related(slug, title, why):
    return {"slug": slug, "title": title, "why": why}


def details(*, service, quick_facts, role, eligibility, exam_stages, passing_rules, steps, prep_plan,
            free_resources, mistakes, faqs, related_items, category_table=None, attempt_rules=None,
            attempt_heading=None, calendar=None, training=None, career_ladder=None, special=None,
            exam_heading=None, related_heading=None, institutes=None, labels=None):
    seen = set()
    free_resources = [r for r in free_resources if not (r["url"] in seen or seen.add(r["url"]))]
    d = {
        "service": service, "quickFacts": quick_facts, "role": role, "eligibility": eligibility,
        "examStages": exam_stages, "passingRules": passing_rules, "steps": steps, "prepPlan": prep_plan,
        "freeResources": free_resources, "mistakes": mistakes, "faqs": faqs, "related": related_items,
    }
    optional = {
        "categoryTable": category_table, "attemptRules": attempt_rules, "attemptHeading": attempt_heading,
        "calendar": calendar, "training": training, "careerLadder": career_ladder, "special": special,
        "examHeading": exam_heading, "relatedHeading": related_heading,
        "institutes": institutes, "labels": labels,
    }
    d.update({k: v for k, v in optional.items() if v})
    return d


CENTRAL_AGE_RELAXATION = [
    ["SC / ST", "5 years"],
    ["OBC (non-creamy layer)", "3 years"],
    ["PwBD (General / EWS)", "10 years"],
    ["PwBD (OBC)", "13 years"],
    ["PwBD (SC / ST)", "15 years"],
    ["Ex-servicemen", "3 years after deducting military service from actual age"],
]
