@echo off
title Tech Nandu - Dev Server
color 0A
cls
echo.
echo  ============================================
echo    Tech Nandu  --  MERN Dev Environment
echo  ============================================
echo.
echo  Frontend  :  http://localhost:3000  (React/Vite)
echo  Backend   :  http://localhost:5000  (Express API)
echo.
echo  Press Ctrl+C in either window to stop.
echo  ============================================
echo.

:: Kill anything already on these ports
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 1 /nobreak >nul

:: Start backend in its own window
start "Backend - Port 5000" cmd /k "cd /d %~dp0server && echo Starting backend... && node server.js"

:: Give backend a moment then start frontend dev server
timeout /t 2 /nobreak >nul
start "Frontend - Port 3000" cmd /k "cd /d %~dp0client && echo Starting frontend... && npm run dev"

:: Open browser after servers start
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo  Both servers started in separate windows.
echo  Close this window anytime.
echo.
pause
