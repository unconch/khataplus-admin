@echo off
echo Starting KhataPlus Admin Panel...
set PORT=3000
start "" "http://localhost:3000"
node server.js
pause
