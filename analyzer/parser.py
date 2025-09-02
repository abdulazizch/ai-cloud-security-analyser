import os
import re

def parse_file(filepath):
    filename = os.path.basename(filepath)

    # Read file
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
    except UnicodeDecodeError:
        with open(filepath, "r", encoding="latin-1") as f:
            code = f.read()

    lines = code.split("\n")
    blocks = []
    buffer = []
    start_line = 1

    function_patterns = [
        re.compile(r"\bdef\b"),         
        re.compile(r"\bfunction\b"),    
        re.compile(r"\bclass\b"),
        re.compile(r"\bSELECT\b", re.I),
        re.compile(r"\bINSERT\b", re.I),
        re.compile(r"\bUPDATE\b", re.I),
        re.compile(r"\bDELETE\b", re.I),
        re.compile(r"\bCREATE\b", re.I),
        re.compile(r"\bDROP\b", re.I)
    ]

    for i, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            if buffer:
                blocks.append({
                    "code": "\n".join(buffer).strip(),
                    "file": filename,
                    "line": start_line
                })
                buffer = []
            start_line = i + 1
        else:
            if any(pat.search(stripped) for pat in function_patterns):
                if buffer:
                    blocks.append({
                        "code": "\n".join(buffer).strip(),
                        "file": filename,
                        "line": start_line
                    })
                    buffer = []
                start_line = i
            buffer.append(line)

    if buffer:
        blocks.append({
            "code": "\n".join(buffer).strip(),
            "file": filename,
            "line": start_line
        })

    return blocks
