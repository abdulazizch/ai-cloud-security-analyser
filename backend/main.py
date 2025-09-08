from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer.analyzer import analyze_file, analyze_blocks, generate_report
import os
import sys
import shutil
import json
from fpdf import FPDF
from datetime import datetime
from fastapi.responses import JSONResponse


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
REPORTS_DIR = "reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)


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


def export_pdf(report, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Vulnerability Analysis Report", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "", 12)
    meta = report.get("metadata", {})
    pdf.multi_cell(0, 8, f"Generated At: {meta.get('generated_at', '')}")
    pdf.multi_cell(0, 8, f"Total Vulnerabilities: {meta.get('total_vulnerabilities', 0)}")
    pdf.multi_cell(0, 8, f"Severity Breakdown: {meta.get('severity_breakdown', {})}")
    pdf.ln(5)

    for idx, finding in enumerate(report.get("findings", []), start=1):
        pdf.set_font("Arial", "B", 12)
        pdf.multi_cell(0, 8, f"{idx}. {finding.get('vulnerability')} ({finding.get('severity')}, Confidence: {finding.get('confidence')}%)")
        pdf.set_font("Arial", "", 12)
        pdf.multi_cell(0, 6, f"File: {finding.get('file')}:{finding.get('line')}")
        pdf.multi_cell(0, 6, f"Recommendation: {finding.get('recommendation')}")
        pdf.multi_cell(0, 6, f"Code Snippet:\n{finding.get('snippet')}\n")
        pdf.ln(2)

    pdf.output(output_path)


def save_report(report, base_name, format_type="json"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = os.path.join(REPORTS_DIR, f"{base_name}_{timestamp}_report.{format_type}")

    if format_type == "json":
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=4)
    elif format_type == "pdf":
        export_pdf(report, file_path)

    return file_path


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

    # path = sys.argv[1
    # base_name = os.path.basename(path).replace(".", "_")
    # json_path = os.path.join(REPORTS_DIR, f"{base_name}_report.json")
    generate_report(mapped_results, saveFile=True)
    return {"results": mapped_results} 


class CodeRequest(BaseModel):
    code: str

@app.post("/analyze-code/")
async def analyze_code_endpoint(request: CodeRequest):
    raw_results = analyze_code_string(request.code)
    mapped_results = map_to_frontend_format("frontend_input", raw_results)
    return {"results": mapped_results}


# @app.get("/export-report/{filename}/{format_type}")
# async def export_report(filename: str, format_type: str):
#     path_json = os.path.join(REPORTS_DIR, f"{filename}.json")
#     path_pdf = os.path.join(REPORTS_DIR, f"{filename}.pdf")

#     if format_type == "json" and os.path.exists(path_json):
#         return FileResponse(path_json, media_type="application/json", filename=f"{filename}.json")
#     elif format_type == "pdf" and os.path.exists(path_pdf):
#         return FileResponse(path_pdf, media_type="application/pdf", filename=f"{filename}.pdf")
#     else:
#         return {"error": "Report not found or format invalid."}


@app.post("/export-report/")
async def export_report(format_type: str, report: dict):
    """
    Export the report in PDF or JSON format
    """
    os.makedirs(REPORTS_DIR, exist_ok=True)
    filename_base = report.get("metadata", {}).get("filename", "report")
    
    if format_type == "json":
        file_path = os.path.join(REPORTS_DIR, f"{filename_base}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=4)
        return FileResponse(file_path, media_type="application/json", filename=f"{filename_base}.json")
    
    elif format_type == "pdf":
        # Assuming you have export_pdf function that takes the report dict and output path
        file_path = os.path.join(REPORTS_DIR, f"{filename_base}.pdf")
        from cli import export_pdf  # your existing function
        export_pdf(report, file_path)
        return FileResponse(file_path, media_type="application/pdf", filename=f"{filename_base}.pdf")
    
    else:
        return {"error": "Unsupported format"}
        

@app.get("/reports-list/")
async def get_reports_list():
    if not os.path.exists(REPORTS_DIR):
        return {"reports": []}

    reports = [f for f in os.listdir(REPORTS_DIR) if f.endswith(".json")]
    return {"reports": reports}

@app.get("/report-file/")
async def get_report_file(filename: str):
    """
    Serve a specific JSON report file by filename
    """
    file_path = os.path.join(REPORTS_DIR, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    with open(file_path, "r", encoding="utf-8") as f:
        report = json.load(f)

    return JSONResponse(content=report)


@app.get("/")
def root():
    return {"message": "API is running"}
