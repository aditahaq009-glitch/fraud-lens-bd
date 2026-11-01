import re
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/analysis", tags=["Scam Analysis"])


class AnalysisRequest(BaseModel):
    text: str = Field(min_length=10, max_length=5000)


# Each rule has: what we look for, points to add, and which scam type it points to.
RULES = [
    {
        "label": "Asks for your OTP or PIN",
        "points": 35,
        "category": "Mobile banking scam",
        "patterns": [r"\botp\b", r"\bpin\b", r"ওটিপি", r"পিন"],
    },
    {
        "label": "Asks you to send money or cash out",
        "points": 30,
        "category": "Mobile banking scam",
        "patterns": [r"\bsend\b.{0,25}\b(money|taka|tk)\b", r"\bcash ?out\b", r"টাকা পাঠান"],
    },
    {
        "label": "Prize, lottery or winner claim",
        "points": 30,
        "category": "Prize or lottery scam",
        "patterns": [r"\blottery\b", r"\bwinner\b", r"\byou (have )?won\b", r"\bprize\b", r"লটারি", r"পুরস্কার"],
    },
    {
        "label": "Job offer with a fee or easy money",
        "points": 25,
        "category": "Job offer scam",
        "patterns": [r"\bregistration fee\b", r"\bwork from home\b", r"\bjob offer\b", r"\bearn \d+", r"চাকরি"],
    },
    {
        "label": "Shortened link",
        "points": 25,
        "category": "Phishing link",
        "patterns": [r"bit\.ly", r"tinyurl", r"cutt\.ly", r"t\.co/"],
    },
    {
        "label": "Contains a web link",
        "points": 10,
        "category": "Phishing link",
        "patterns": [r"https?://"],
    },
    {
        "label": "Claims to be customer care, officer or police",
        "points": 20,
        "category": "Impersonation scam",
        "patterns": [r"customer (care|service)", r"\bhelpline\b", r"\bofficer\b", r"\bpolice\b"],
    },
    {
        "label": "Pressure or urgency",
        "points": 20,
        "category": None,
        "patterns": [r"\burgent(ly)?\b", r"\bimmediately\b", r"account.{0,20}(blocked|suspended|closed)", r"জরুরি"],
    },
]

NEXT_STEPS = {
    "High": [
        "Do not reply, click any link, or send money.",
        "Never share your OTP or PIN with anyone.",
        "Block the sender and save screenshots as evidence.",
        "If you already shared something, call your bKash, Nagad or bank official helpline now.",
        "Submit a scam report on Fraud Lens BD.",
    ],
    "Medium": [
        "Do not click links or share personal details yet.",
        "Check with the real company using its official number or app.",
        "Ask a family member or friend before you act.",
    ],
    "Low": [
        "No strong warning signs found, but stay careful.",
        "Never share your OTP or PIN.",
        "If something feels wrong, verify with the official source.",
    ],
}


def analyze_text(text: str) -> dict:
    matched = [
        rule for rule in RULES
        if any(re.search(p, text, re.IGNORECASE) for p in rule["patterns"])
    ]

    score = min(sum(rule["points"] for rule in matched), 100)

    if score >= 60:
        level = "High"
    elif score >= 30:
        level = "Medium"
    else:
        level = "Low"

    # Scam type = the category with the most points
    category_points = {}
    for rule in matched:
        if rule["category"]:
            category_points[rule["category"]] = (
                category_points.get(rule["category"], 0) + rule["points"]
            )
    if category_points:
        category = max(category_points, key=category_points.get)
    else:
        category = "No clear scam pattern"

    if matched:
        explanation = f"We found {len(matched)} warning sign(s) in this message."
    else:
        explanation = "We did not find known warning signs in this message."

    return {
        "risk_score": score,
        "risk_level": level,
        "category": category,
        "indicators": [{"label": r["label"], "points": r["points"]} for r in matched],
        "explanation": explanation,
        "next_steps": NEXT_STEPS[level],
        "method": "rule-based prototype (not AI yet)",
    }


# Analyze suspicious text
@router.post("")
def analyze(request: AnalysisRequest):
    return analyze_text(request.text)
