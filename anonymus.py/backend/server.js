const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve the anonymous-chat.html file directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../anonymous-chat.html'));
});

// API endpoints for registration and user management
// Registration endpoint
app.post('/api/register', (req, res) => {
  try {
    const { interests, education } = req.body;
    
    if (!interests || !education) {
      return res.status(400).json({ error: 'Interests and education are required' });
    }
    
    const userId = uuidv4();
    // In a real application, you would store this in a database
    // For this demo, we'll just return the userId
    
    res.json({ userId, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user profile
app.get('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    // In a real application, you would fetch this from a database
    // For this demo, we'll just return a mock response
    
    res.json({ 
      userId,
      education: 'Bachelor\'s Degree'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// In-memory storage for users and chats
const users = new Map(); // userId -> { interests, education, socketId }
const waitingUsers = new Set(); // userIds waiting for match
const matches = new Map(); // userId -> matchedUserId
const userSessions = new Map(); // sessionId -> { user1Id, user2Id }

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // User joins with their userId
  socket.on('join', (userId) => {
    // In a real application, you would verify the userId exists in your database
    // For this demo, we'll just accept any userId
    
    socket.userId = userId;
    console.log('User joined:', userId);
    
    // Add user to waiting list
    waitingUsers.add(userId);
    
    // Try to find a match
    findMatch(userId);
  });
  
  // Handle chat messages
  socket.on('message', (data) => {
    const { message } = data;
    const userId = socket.userId;
    
    if (!userId) return;
    
    // For this demo, we'll just echo the message back
    // In a real application, you would find the matched user and send to them
    socket.emit('message', {
      message: `Echo: ${message}`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      const userId = socket.userId;
      
      // Remove from waiting list
      waitingUsers.delete(userId);
      
      console.log('User disconnected:', userId);
    }
  });
});

// Simple matching function for demo purposes
function findMatch(userId) {
  // For this demo, we'll just send a match notification immediately
  // In a real application, you would implement proper matching logic
  
  setTimeout(() => {
    if (waitingUsers.has(userId)) {
      // Remove user from waiting list
      waitingUsers.delete(userId);
      
      // Send match notification
      io.to(socket.id).emit('matched', { 
        sessionId: uuidv4(),
        message: 'You are now connected with a partner!'
      });
    }
  }, 2000);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
  console.log(`Access the application from other devices on the same network at: http://YOUR_IP_ADDRESS:${PORT}`);
});