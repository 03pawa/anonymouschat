@echo off
echo ========================================
echo Anonymous Chat Application Setup
echo ========================================
echo.
echo This script will help you set up and run the Anonymous Chat application.
echo.
echo Prerequisites:
echo - Node.js (version 16 or higher) must be installed
echo - Git must be installed
echo.
echo Press any key to continue...
pause >nul
echo.
echo Step 1: Installing backend dependencies...
cd /d "%~dp0backend"
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)
echo.
echo Step 2: Installing frontend dependencies...
cd /d "%~dp0frontend"
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %errorlevel%
)
echo.
echo Step 3: Starting the application...
echo.
echo The application will be available at:
echo - Local access: http://localhost:3001
echo - Network access: http://YOUR_IP_ADDRESS:3001
echo.
echo To find your IP address, open a new command prompt and run: ipconfig
echo Look for "IPv4 Address" under your active network connection.
echo.
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0backend"
node simple-server.js