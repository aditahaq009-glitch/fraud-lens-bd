from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

# Mock dataset for demonstration
MOCK_DATABASE = [
    {
        "id": "1",
        "query": "01700000000",
        "category": "Mobile Banking Scam",
        "status": "Reported Scam (Demo)",
        "details": "Multiple user reports claiming fake bKash PIN reset requests."
    },
    {
        "id": "2",
        "query": "fake-lottery.com",
        "category": "Phishing Domain",
        "status": "Flagged (Demo)",
        "details": "Reported URL associated with SMS lottery scam links."
    }
]

@router.get("/search")
def search_registry(q: str = "") -> Dict[str, Any]:
    query_str = q.strip().lower()
    
    # Always return an array/list, even when query is empty or no matches are found
    if not query_str:
        return {"query": q, "results": []}
    
    matched_results = [
        item for item in MOCK_DATABASE 
        if query_str in item["query"].lower() or query_str in item["category"].lower()
    ]
    
    return {
        "query": q,
        "results": matched_results  # Guaranteed to be a list []
    }