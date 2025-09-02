# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer.analyzer import analyze_file, analyze_blocks
import os
import shutil

app = FastAPI(title="AI-Powered Cloud Security Analyzer")

# Allow frontend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def map_to_frontend_format(file_name: str, results: list):
    mapped = []
    for idx, r in enumerate(results, start=1):
        mapped.append({
            "id": idx,
            "filename": r.get("file", file_name),
            "line": r.get("line", 1),
            "issueType": r.get("vulnerability", "Unknown"),
            "severity": r.get("severity", "Medium"),
            "confidence": int(r.get("confidence", 0)),
            "recommendation": r.get("recommendation", "Follow secure coding practices."),
            "codeSnippet": r.get("snippet", "")
        })
    return mapped



def analyze_code_string(code_str, threshold=0.8):

    lines = code_str.split("\n")
    blocks = []
    buffer = []
    start_line = 1

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            if buffer:
                blocks.append({"code": "\n".join(buffer).strip(), "file": "frontend_input", "line": start_line})
                buffer = []
            start_line = i + 1
        else:
            if any(kw in stripped for kw in ["def ", "function ", "class ", "SELECT", "INSERT", "UPDATE", "DELETE"]):
                if buffer:
                    blocks.append({"code": "\n".join(buffer).strip(), "file": "frontend_input", "line": start_line})
                    buffer = []
                start_line = i
            buffer.append(line)
    if buffer:
        blocks.append({"code": "\n".join(buffer).strip(), "file": "frontend_input", "line": start_line})

    return analyze_blocks(blocks, threshold=threshold)

@app.post("/analyze-file/")
async def analyze_file_endpoint(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    raw_results = analyze_file(file_location)
    mapped_results = map_to_frontend_format(file.filename, raw_results)
    
    os.remove(file_location)
    
    return {"results": mapped_results}


class CodeRequest(BaseModel):
    code: str

@app.post("/analyze-code/")
async def analyze_code_endpoint(request: CodeRequest):
    raw_results = analyze_code_string(request.code)
    mapped_results = map_to_frontend_format("frontend_input", raw_results)
    return {"results": mapped_results}


@app.get("/")
def root():
    return {"message": "API is running"}
