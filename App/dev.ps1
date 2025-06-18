# Function to handle cleanup on script exit
$cleanup = {
    Write-Host "`nStopping servers..."
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    exit
}

# Register the cleanup function to run on script exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action $cleanup

# Start backend server
Write-Host "Starting backend server..."
Start-Job -ScriptBlock {
    Set-Location backend
    .\.venv\Scripts\activate
    uvicorn app.main:app --reload
}

# Start frontend server
Write-Host "Starting frontend server..."
Start-Job -ScriptBlock {
    Set-Location frontend
    npm run dev
}

Write-Host "`nBoth servers are running. Press Ctrl+C to stop them."
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000`n"

# Keep the script running and show output from both jobs
while ($true) {
    Get-Job | Receive-Job
    Start-Sleep -Seconds 1
} 