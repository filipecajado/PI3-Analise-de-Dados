#!/bin/bash

# Function to handle cleanup on script exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to catch script termination
trap cleanup EXIT INT TERM

# Start backend server
echo "Starting backend server..."
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload &
cd ..

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev &
cd ..

# Wait for both processes
wait 