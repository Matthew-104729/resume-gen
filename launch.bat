@echo off
echo ========================================
echo   Resume Builder - Local Server
echo ========================================
echo.
echo This will start a local server and open your browser.
echo.
echo Press Ctrl+C to stop the server when done.
echo.
pause
echo.
echo Building the app...
call npm run build
if errorlevel 1 (
    echo.
    echo Build failed! Please check for errors above.
    pause
    exit /b 1
)
echo.
echo Build successful! Starting server...
echo.
start http://localhost:4173
call npm run preview
pause

