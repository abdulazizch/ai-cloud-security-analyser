@echo off
echo Starting AI-Powered Cloud Security Analyzer...

:: Step 1 – Start backend in virtual environment
call venv\Scripts\activate
start cmd /k "uvicorn backend.main:app --reload"

:: Step 2 – Wait for backend to be ready
echo Waiting for backend to start...
:waitloop
timeout /t 2 >nul
curl -s http://127.0.0.1:8000 >nul 2>&1
if errorlevel 1 (
    goto waitloop
)
echo Backend is up!

:: Step 3 – Start frontend
cd frontend
start cmd /k "npm start"

echo Tool launched successfully!
