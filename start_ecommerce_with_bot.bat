@echo off
echo ========================================================
echo Starting Cara E-Commerce + AI Support Chatbot Engine
echo ========================================================

:: Give Node.js its own window to start the main E-Commerce Server
echo Starting E-Commerce Server on Port 3000...
start "Cara Node Server" cmd /k "npm i && node server.js"

:: Navigate to the python chatbot backend, install requirements, and start it
echo Starting AI Chatbot Backend Server on Port 8000...
cd Best_chatbot\backend
start "Cara AI Chatbot Backend" cmd /k "pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Both servers are starting up in separate windows!
echo It may take a minute for Python to install dependencies if this is your first time.
echo.
echo Once they are running, open your browser and go to:
echo  --^> http://localhost:3000/index.html
echo.
pause
