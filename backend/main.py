from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import existing routers along with the search router
from search import router as search_router
# Keep existing routers intact:
# from reports import router as reports_router
# from analysis import router as analysis_router

app = FastAPI(title="Fraud Lens BD API")

# Configure CORS Middleware for Next.js frontend (port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include search router
app.include_router(search_router, prefix="", tags=["Search"])

# Keep existing routers registered:
# app.include_router(reports_router, prefix="", tags=["Reports"])
# app.include_router(analysis_router, prefix="", tags=["Analysis"])

@app.get("/")
def read_root():
    return {"message": "Fraud Lens BD API is running"}