from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

# Sample mock database of scam reports for demonstration
MOCK_REPORTS = [
    {"id": 1, "type": "phone", "identifier": "+8801700000000", "status": "Verified Fraud", "category": "Mobile Banking Scam"},
    {"id": 2, "type": "wallet", "identifier": "01811111111", "status": "Disputed", "category": "Advance Payment Scam"},
    {"id": 3, "type": "domain", "identifier": "fake-shop-bd.com", "status": "Verified Fraud", "category": "E-commerce Fraud"},
]

@router.get("/search")
def search_reports(query: Optional[str] = Query(None, description="Phone, wallet, domain, or name")):
    if not query:
        return {"results": [], "message": "Please provide a search query."}
    
    # Normalize query (lowercase) for simple matching
    q = query.lower()
    matched = [
        item for item in MOCK_REPORTS 
        if q in item["identifier"].lower() or q in item["category"].lower()
    ]
    
    return {
        "query": query,
        "count": len(matched),
        "results": matched if matched else "No records found matching your query (mock data)."
    }