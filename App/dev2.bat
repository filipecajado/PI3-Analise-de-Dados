@echo off
echo Starting development servers...

:: Start both servers in a split pane using Windows Terminal
wt -w 0 new-tab -d "%~dp0backend" cmd /k ".venv\Scripts\activate && uvicorn app.main:app --reload" ; split-pane -H -d "%~dp0frontend" cmd /k "npm run dev"

echo Both servers are running in Windows Terminal.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
