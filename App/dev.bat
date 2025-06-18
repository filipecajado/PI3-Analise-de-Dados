@echo off
echo Starting development servers...

:: Start backend server
start cmd /k "cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload"

:: Start frontend server
start cmd /k "cd frontend && npm run dev"

echo Both servers are running. Press Ctrl+C in each window to stop them. 