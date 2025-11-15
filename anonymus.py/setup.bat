@echo off
echo Setting up Anonymous Chat Group Application
echo ========================================

echo Note: This project requires Node.js and npm to be installed.
echo Please ensure you have Node.js (v16+) installed before proceeding.
echo You can download it from https://nodejs.org/
echo.

echo Installing dependencies...
echo ========================

echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)

echo Installing frontend dependencies...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %errorlevel%
)

cd ..

echo.
echo Dependencies installed successfully!
echo.
echo To start the application, run:
echo   start-app.bat
echo.
echo Press any key to exit...
pause >nul