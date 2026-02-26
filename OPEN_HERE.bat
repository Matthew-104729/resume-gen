@echo off
title Resume Builder Launcher
color 0A
echo.
echo ========================================
echo   Resume Builder - Quick Launcher
echo ========================================
echo.
echo Starting local server...
echo.
echo The app will open in your browser automatically.
echo.
echo To stop the server, close this window or press Ctrl+C
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Check if dist folder exists
if not exist "dist" (
    echo Building the app first...
    call npm run build
    if errorlevel 1 (
        echo.
        echo Build failed! Please check for errors.
        pause
        exit /b 1
    )
)

REM Start server and open browser
start http://localhost:4173
call npm run preview

