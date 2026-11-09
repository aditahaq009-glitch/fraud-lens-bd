
from pathlib import Path
from uuid import uuid4
import os

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter(prefix="/evidence", tags=["Evidence"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

ALLOWED_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "application/pdf": ".pdf",
}

FILE_SIGNATURES = {
    ".png": (b"\x89PNG\r\n\x1a\n",),
    ".jpg": (b"\xff\xd8\xff",),
    ".pdf": (b"%PDF-",),
}


@router.post("/upload")
async def upload_evidence(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PNG, JPG, and PDF files are allowed."
        )

    extension = ALLOWED_TYPES[file.content_type]

    contents = await file.read(MAX_FILE_SIZE + 1)

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File must be 5 MB or smaller."
        )

    if not contents.startswith(FILE_SIGNATURES[extension]):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format."
        )

    file_id = str(uuid4())
    filename = f"{file_id}{extension}"
    destination = UPLOAD_DIR / filename

    try:
        with open(destination, "xb") as output:
            output.write(contents)
    except OSError:
        raise HTTPException(
            status_code=500,
            detail="Could not save evidence."
        )
    finally:
        await file.close()

    return {
        "message": "Evidence uploaded successfully",
        "file_id": file_id,
        "filename": filename,
        "original_name": os.path.basename(file.filename or "evidence"),
    }
