@echo off
title Paso Del Norte — Stop Server
echo.
echo  Stopping server on port 8080...
echo.
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo  Server stopped.
echo.
pause
