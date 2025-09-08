import os
import re
import json
import torch
import numpy as np
import json
from datetime import datetime
from collections import Counter
from transformers import AutoTokenizer, AutoModel
from . import parser, threat_data

# Model & Device Setup
MODEL_NAME = "microsoft/codebert-base"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
model.to(DEVICE)
model.eval()

def embed_text(text: str) -> torch.Tensor:
    # Convert text into a normalized embedding vector using CodeBERT.
    with torch.no_grad():
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256
        )
        inputs = {k: v.to(DEVICE) for k, v in inputs.items()}
        outputs = model(**inputs)

        attention_mask = inputs["attention_mask"]
        last_hidden = outputs.last_hidden_state
        mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden.size()).float()
        sum_hidden = torch.sum(last_hidden * mask_expanded, dim=1)
        sum_mask = mask_expanded.sum(dim=1).clamp(min=1e-9)
        mean_pooled = sum_hidden / sum_mask

        return torch.nn.functional.normalize(mean_pooled, p=2, dim=1)

# Similarity
def cosine_similarity(vec1, vec2):
    return torch.mm(vec1, vec2.T).item()

# Analysis Logic
def analyze_blocks(blocks, threshold=0.80):
    results = []

    threat_embeddings = []
    for threat in threat_data.THREAT_DATABASE:
        if not threat.get("use_regex", False):
            emb = embed_text(threat["pattern"])
            threat_embeddings.append((threat, emb))

    for block in blocks:
        code = block["code"]
        code_embedding = embed_text(code)

        for threat in threat_data.THREAT_DATABASE:
            if threat.get("use_regex", False):
                try:
                    if re.search(threat["pattern"], code, re.IGNORECASE):
                        results.append({
                            "file": block["file"],
                            "line": block["line"],
                            "vulnerability": threat["label"],
                            "description": threat["description"],
                            "recommendation": threat["recommendation"],
                            "similarity": 1.0,
                            "severity": threat.get("severity", "High"),
                            "confidence": 100,
                            "snippet": code[:200],
                            "match_type": "Regex"
                        })
                except re.error as e:
                    print(f"[!] Invalid regex for {threat['label']}: {e}")

        for threat, threat_emb in threat_embeddings:
            sim = cosine_similarity(code_embedding, threat_emb)
            if sim >= threshold:
                confidence = round(sim * 100, 1)
                results.append({
                    "file": block["file"],
                    "line": block["line"],
                    "vulnerability": threat["label"],
                    "description": threat["description"],
                    "recommendation": threat["recommendation"],
                    "similarity": round(sim, 2),
                    "severity": threat.get("severity", "Medium"),
                    "confidence": confidence,
                    "snippet": code[:200],
                    "match_type": "Semantic"
                })

    severity_order = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
    results.sort(
        key=lambda r: (severity_order.get(r["severity"], 0), r["confidence"]),
        reverse=True
    )

    return results


def analyze_file(filepath, threshold=0.80):
    blocks = parser.parse_file(filepath)
    return analyze_blocks(blocks, threshold)

def analyze_folder(folderpath, threshold=0.80):
    all_results = []
    for root, _, files in os.walk(folderpath):
        for file in files:
            if file.endswith((".py", ".js", ".php", ".sql")):
                filepath = os.path.join(root, file)
                all_results.extend(analyze_file(filepath, threshold))
    return all_results

def save_json(results, filename="analysis_report.json"):
    with open(filename, "w") as f:
        json.dump(results, f, indent=4)
    print(f"[+] Results saved to {filename}")


# Generate Report Function
# def generate_report(results, output_json=None):
#     severity_counts = Counter([r["severity"] for r in results])

#     report = {
#         "metadata": {
#             "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#             "total_vulnerabilities": len(results),
#             "severity_breakdown": dict(severity_counts)
#         },
#         "findings": results
#     }

#     if output_json:
#         with open(output_json, "w", encoding="utf-8") as f:
#             json.dump(report, f, indent=4)
#         print(f"[+] Report saved to {output_json}")

#     return report


def generate_report(results, filename=None, saveFile=None):
    from datetime import datetime

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    if not filename:
        filename = f"report_{timestamp}.json"
    
    filepath = os.path.join(REPORTS_DIR, filename)
    
    from collections import Counter
    severity_counts = Counter([r["severity"] for r in results])
    report = {
        "metadata": {
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_vulnerabilities": len(results),
            "severity_breakdown": dict(severity_counts),
            "filename": filename
        },
        "findings": results
    }
    
    # Save JSON
    if saveFile:
        with open(filepath, "w", encoding="utf-8") as f:
            import json
            json.dump(report, f, indent=4)
    
    print(f"[+] Report saved to {filepath}")
    return report


def print_summary(report):
    print("\n=== Vulnerability Analysis Summary ===")
    print(f"Generated: {report['metadata']['generated_at']}")
    print(f"Total Findings: {report['metadata']['total_vulnerabilities']}")
    print("Severity Breakdown:")

    for sev, count in report["metadata"]["severity_breakdown"].items():
        print(f"  {sev}: {count}")

    print("\nTop Findings:")
    for f in report["findings"][:5]:  # show top 5
        print(f" - [{f['severity']}] {f['vulnerability']} "
              f"(Confidence: {f['confidence']}%) "
              f"in {f['file']}:{f['line']}")