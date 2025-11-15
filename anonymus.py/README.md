# Anonymous Chat Application

This is an anonymous chat application that allows users to connect with others based on shared interests.

## Features
- Anonymous chat with random partners
- Interest-based matching
- Video sharing capabilities
- Report abuse functionality
- Responsive design for all devices

## Prerequisites
- Node.js (version 16 or higher)
- Git (for cloning the repository)

## Setup Instructions

### For Windows Users
1. Double-click on `setup-and-run.bat` to automatically install dependencies and start the server
2. Access the application at:
   - Local: http://localhost:3001
   - Network: http://YOUR_IP_ADDRESS:3001 (replace YOUR_IP_ADDRESS with your actual IP)

### For Manual Setup
1. Open a terminal/command prompt
2. Navigate to the project directory
3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```
5. Start the server:
   ```
   cd ../backend
   node simple-server.js
   ```

## Accessing the Application

### From the Host Machine
- Open your browser and go to: http://localhost:3001

### From Other Devices on the Same Network
1. Find your IP address:
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your active network connection
2. On the other device, open a browser and go to: http://YOUR_IP_ADDRESS:3001

### From Anywhere on the Internet
To make your server accessible from anywhere:
1. Make sure your server is running
2. Open a new terminal/command prompt
3. Run: `ssh -R 80:localhost:3001 nokey@localhost.run`
4. Use the public URL provided by localhost.run

## File Structure
- `backend/` - Server-side code
- `frontend/` - Client-side code
- `anonymous-chat.html` - Standalone HTML version
- `setup-and-run.bat` - Automated setup script for Windows

## Troubleshooting
- If port 3001 is already in use, you can change it by setting the PORT environment variable
- Make sure Windows Firewall allows connections on port 3001 for network access
- If you encounter any issues, check the terminal output for error messages

# Anonymous Chat Group

A web application for anonymous chatting where users are matched based on their personality traits and interests.

## Features

- Anonymous chatting with personality-based matching
- User registration with interests and education level
- Real-time messaging using WebSocket
- Privacy protection - user identities are hidden
- Terms of service enforcement with account prohibition for illegal activities
- Network accessibility - can be accessed from other devices on the same network
- Single-file server mode - no need to share multiple files

## Project Structure

```
.
├── backend/
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── anonymous-chat.html    # Standalone HTML file (server mode)
├── start-server.bat       # Script to start server mode
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── App.jsx        # Main App component
    │   ├── main.jsx       # Entry point
    │   └── ...
    ├── index.html         # HTML template
    └── package.json       # Frontend dependencies
```

## How It Works

1. **Registration**: Users register by providing their interests and education level
2. **Matching**: The system matches users based on interest similarity
3. **Chatting**: Connected users can chat anonymously in real-time
4. **Privacy**: Personal details are kept private from other users
5. **Safety**: Illegal activities result in account prohibition

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Automated Setup

1. Run the setup script:
   ```
   setup.bat
   ```

### Manual Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

4. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Option 1: Server Mode (Recommended - WhatsApp-like experience)

In this mode, the application runs as a single server that can be accessed from any device without sharing files:

1. Start the server:
   ```
   start-server.bat
   ```
   Or manually:
   ```
   cd backend
   node server.js
   ```

2. Access the application:
   - Local access: http://localhost:3001
   - Network access: http://YOUR_IP_ADDRESS:3001

### Option 2: Development Mode (Two-server setup)

1. Start the backend server:
   ```
   run_backend.bat
   ```
   Or manually:
   ```
   cd backend
   npm start
   ```

2. Start the frontend server:
   ```
   run_frontend.bat
   ```
   Or manually:
   ```
   cd frontend
   npm run dev
   ```

## Accessing from Other Devices

To access the application from other devices (mobile, laptop, etc.) on the same network:

1. Find your computer's IP address:
   - On Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your active network connection

2. Other devices can access the application using:
   - URL: http://YOUR_IP_ADDRESS:3001

For example, if your IP address is 192.168.1.100:
- URL: http://192.168.1.100:3001

Make sure your firewall allows connections on port 3001.

## API Endpoints

- `POST /api/register` - Register a new user
- `GET /api/user/:userId` - Get user information

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebSocket

## Matching Algorithm

Users are matched based on the similarity of their interests using the Jaccard similarity coefficient. A threshold of 30% similarity is required for a match.

## Privacy & Safety

- All personal details are kept confidential
- Users are identified only by randomly generated IDs during chat
- Illegal activities are monitored and will result in account prohibition
- Users must agree to terms of service before using the platform