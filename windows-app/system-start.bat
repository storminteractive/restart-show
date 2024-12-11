@echo off
setlocal

echo Starting socket-server.js...
start "socket-server" /B node socket-server.js
timeout /T 2 /NOBREAK >nul
tasklist /FI "IMAGENAME eq node.exe" | find /I "socket-server.js" >nul && (
    echo socket-server.js is running.
) || (
    echo socket-server.js failed to start.
)

echo Starting video-site.js...
start "video-site" /B node video-site.js
timeout /T 2 /NOBREAK >nul
tasklist /FI "IMAGENAME eq node.exe" | find /I "video-site.js" >nul && (
    echo video-site.js is running.
) || (
    echo video-site.js failed to start.
)

echo Starting control-board.js...
start "control-board" /B node control-board.js
timeout /T 2 /NOBREAK >nul
tasklist /FI "IMAGENAME eq node.exe" | find /I "control-board.js" >nul && (
    echo control-board.js is running.
) || (
    echo control-board.js failed to start.
)

echo Starting Chrome in fullscreen mode on localhost:5000...
start chrome --start-fullscreen http://localhost:5000

echo All services started. Press Ctrl+C to stop all services.

:waitForExit
choice /C K /N /M "Press 'k' to stop all services" >nul

echo Shutting down all services...
taskkill /FI "WINDOWTITLE eq socket-server"
taskkill /FI "WINDOWTITLE eq video-site"
taskkill /FI "WINDOWTITLE eq control-board"

echo All services stopped.
endlocal