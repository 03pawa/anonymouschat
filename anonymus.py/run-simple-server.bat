@echo off
echo Starting Anonymous Chat Simple Server...
echo ======================================
echo Server will be accessible at:
echo - On this computer: http://localhost:3001
echo - On other devices on the same network: http://10.220.250.147:3001
echo ======================================
echo.
echo To access from other devices:
echo 1. Make sure all devices are on the same WiFi network
echo 2. Open a browser on the other device
echo 3. Go to http://10.220.250.147:3001
echo.
echo Press Ctrl+C to stop the server
echo.
cd backend
node simple-server.js