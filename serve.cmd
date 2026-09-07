@echo off
setlocal
REM ============================================================
REM  Local preview for the Torrey Pines Science Olympiad site.
REM
REM  The site uses clean URLs (/apply/ not /apply.html). A folder
REM  URL only resolves to its index.html when a real web server
REM  serves it, so opening the files with file:// cannot work.
REM
REM  Double-click this file. Press Ctrl+C in the window to stop.
REM ============================================================

cd /d "%~dp0"

set "PY="
where py >nul 2>&1 && set "PY=py"
if not defined PY where python >nul 2>&1 && set "PY=python"

if not defined PY goto nopython

echo.
echo   Serving  %CD%
echo   at       http://localhost:8000
echo.
echo   Pages:   /   /apply/   /roster/   /about/   /faq/
echo.
echo   Leave this window open while you browse.
echo   Press Ctrl+C to stop the server.
echo.

start "" http://localhost:8000/
%PY% -m http.server 8000

echo.
echo   Server stopped. If it stopped straight away, port 8000
echo   may already be in use by another program.
echo.
pause
goto :eof

:nopython
echo.
echo   Python was not found on this machine.
echo   Install it from https://python.org and tick
echo   "Add Python to PATH" during setup, then run this again.
echo.
pause
