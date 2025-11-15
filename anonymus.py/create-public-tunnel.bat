@echo off
echo ========================================
echo Anonymous Chat - Public Access
echo ========================================
echo.
echo This script will create a public tunnel for your Anonymous Chat application.
echo.
echo Prerequisites:
echo - Your server must be running on port 3001
echo - SSH must be available on your system
echo.
echo Press any key to continue...
pause >nul
echo.
echo Creating public tunnel...
echo.
echo Once the tunnel is created, you will see a public URL that you can share
echo with anyone to access your Anonymous Chat application from anywhere.
echo.
echo To stop the tunnel, press Ctrl+C
echo.
ssh -R 80:localhost:3001 nokey@localhost.run