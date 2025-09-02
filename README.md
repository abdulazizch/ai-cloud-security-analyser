# AI-Powered Cloud Security Analyzer for Web Applications
# Project Repository
# https://github.com/abdulazizch/ai-cloud-security-analyser.git

AI-Powered Cloud Security Analyzer – Quick Start
📌 Overview

A fully AI-enabled tool to detect security vulnerabilities in web app source code using CodeBERT embeddings.
Supports CLI, backend API, and React frontend.

Backend: Python + FastAPI, exposes endpoints for file or code string analysis.

Frontend: React + Tailwind, interactive results with filters, search, and export.

AI Engine: microsoft/codebert-base for semantic analysis of code blocks and Hugging face Bert Base model..

⚡ Quick Setup

# If you have all the requirements installed and have setup a virtual environement in the root folder than the tool can be started by double clicking on the run_tool.bat file or you can go through followin steps instead.

1️⃣ Backend Setup

cd MAIN-TOOL
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

pip install -r backend/requirements.txt
uvicorn backend.main:app --reload  #to start the backend server


Runs at: http://127.0.0.1:8000

API documentation:
Endpoints:

/analyze-file/ – Upload a code file for analysis.

/analyze-code/ – Send raw code string for AI-powered analysis.

2️⃣ Frontend Setup
cd MAIN-TOOL/frontend
npm install
npm start


Runs at: http://localhost:3000

Connects automatically to backend API for live analysis.

Features:

File upload or paste code for analysis

Filter by severity

Search by filename or vulnerability

PDF & JSON export

3️⃣ CLI Analyzer
cd MAIN-TOOL
python cli.py folder_Path/file_Name

Then system will ask for the selection of pdf or json format for the filwe
Choose p for PDF and j for Json format and Enter.
The report file will be saved in the reports folder.

Examples:
python cli.py test_samples\react-node-vuln\backend\server.js


Uses CodeBERT embeddings to semantically detect vulnerabilities.

Detects regex-based patterns for legacy coverage.

Returns confidence scores based on semantic similarity.

🧪 Demo & Testing

Use demo apps inside test_samples/ to test AI detection.

Frontend allows instant code analysis without saving files.

Backend supports both file uploads and raw code input.

📚 Notes

Recommended: GPU for faster embeddings (CPU works but slower).

Ensure Python >= 3.10 and Node.js >= 18.

All code snippets are normalized and semantically analyzed with CodeBERT.

📂 File Structure
MAIN-TOOL/
├── backend/        # FastAPI backend
├── frontend/       # React frontend
├── analyzer/       # AI-based analyzer (CodeBERT)
├── test_samples/      # Sample apps for testing
├── reports/        # Generated Reports
├── requirements.txt
├── package.json
└── README.md
└── run_tool.bat  # One click system start file


📜 License
This project is for academic purposes as part of an MSc thesis.
You may adapt and reuse parts of the code for educational or research use.

👨‍💻 Author
Abdul Aziz Tariq — MSc Computer Science and Technology Student & Full-Stack Develoeper
University: Ulster University London