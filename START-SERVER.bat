@echo off
title Paso Del Norte — Local Server
echo.
echo  ==========================================
echo   PASO DEL NORTE — Starting Local Server
echo  ==========================================
echo.
echo  Server: http://localhost:8080
echo  Marketing Hub: http://localhost:8080/marketing.html
echo  Admin: http://localhost:8080/admin.html
echo.
echo  Press Ctrl+C to stop the server.
echo.

cd /d "%~dp0"
start "" "http://localhost:8080"
python -m http.server 8080

pause
