const http = require('http');
const fs = require('fs');
const path = require('path');
const aiModeration = require('./ai-moderation.js');

const hostname = '0.0.0.0';
const port = 3001;

// Track active sessions and banned users
const activeSessions = new Map();
const bannedUsers = new Set();

// Serve the anonymous chat HTML file
const server = http.createServer((req, res) => {
  // Set additional headers for better network accessibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Handle chat messages
  if (req.url === '/send-message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const messageData = JSON.parse(body);
        const { sessionId, message, userId } = messageData;
        
        // Check if user is banned
        if (bannedUsers.has(userId)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            status: 'error', 
            message: 'You have been banned from this service.',
            banned: true
          }));
          return;
        }
        
        // AI-based content analysis
        const analysis = aiModeration.analyzeText(message);
        const action = aiModeration.determineAction(analysis);
        
        // Log the analysis for debugging
        console.log(`AI Analysis for user ${userId}: Severity=${analysis.severity}, Score=${analysis.score}, Action=${action}`);
        
        // Take action based on AI analysis
        if (action === 'ban') {
          // Log the violation
          console.log(`Bannable content detected from user ${userId}: ${message}`);
          console.log(`Analysis details:`, analysis);
          
          // Ban the user
          bannedUsers.add(userId);
          
          // Disconnect the session
          if (activeSessions.has(sessionId)) {
            activeSessions.delete(sessionId);
          }
          
          // Return error response
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            status: 'error', 
            message: 'Inappropriate content detected. You have been permanently banned from this service.',
            banned: true,
            analysis: analysis
          }));
          return;
        } else if (action === 'disconnect') {
          // Log the violation
          console.log(`Inappropriate content detected from user ${userId}: ${message}`);
          console.log(`Analysis details:`, analysis);
          
          // Disconnect the user
          if (activeSessions.has(sessionId)) {
            activeSessions.delete(sessionId);
          }
          
          // Return error response
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            status: 'error', 
            message: 'Inappropriate content detected. Your session has been terminated.',
            disconnected: true,
            analysis: analysis
          }));
          return;
        } else if (action === 'warn') {
          // For warnings, we could send a warning to the user but still allow the message
          // For now, we'll just log it
          console.log(`Mild inappropriate content detected from user ${userId}: ${message}`);
          console.log(`Analysis details:`, analysis);
        }
        
        // Store session info
        if (!activeSessions.has(sessionId)) {
          activeSessions.set(sessionId, {
            userId: userId,
            startTime: new Date(),
            messageCount: 0
          });
        }
        
        // Update session info
        const session = activeSessions.get(sessionId);
        session.messageCount++;
        session.lastMessage = message;
        session.lastMessageTime = new Date();
        
        // Return success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'success', 
          message: 'Message sent successfully',
          analysis: analysis
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'error', 
          message: 'Invalid message data'
        }));
      }
    });
    return;
  }
  
  // Handle video streaming requests
  if (req.url.startsWith('/stream')) {
    // In a real implementation, this would handle WebRTC signaling
    // For this demo, we'll just return a simple response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'success', 
      message: 'Video streaming endpoint ready',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Handle abuse reporting
  if (req.url === '/report-abuse' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const reportData = JSON.parse(body);
        console.log('Abuse report received:', reportData);
        
        // In a real implementation, this would save to a database
        // and notify moderators
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'success', 
          message: 'Abuse report submitted successfully',
          reportId: 'report_' + Date.now()
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'error', 
          message: 'Invalid report data'
        }));
      }
    });
    return;
  }
  
  // Serve the main HTML file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'anonymous-chat.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }
  
  // Serve CSS files
  if (req.url.endsWith('.css')) {
    fs.readFile(path.join(__dirname, req.url), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
    return;
  }
  
  // Serve JS files
  if (req.url.endsWith('.js')) {
    fs.readFile(path.join(__dirname, req.url), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
    return;
  }
  
  // Serve image files
  if (req.url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
    const ext = path.extname(req.url).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'image/jpeg';
    
    fs.readFile(path.join(__dirname, req.url), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }
  
  // 404 for everything else
  res.writeHead(404);
  res.end('Not found');
});

// Periodically clean up old sessions (optional)
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of activeSessions.entries()) {
    // Remove sessions older than 1 hour
    if (now - session.startTime > 3600000) {
      activeSessions.delete(sessionId);
    }
  }
}, 300000); // Every 5 minutes

server.listen(port, hostname, () => {
  console.log(`Anonymous Chat Server running at http://${hostname}:${port}/`);
  console.log('Press Ctrl+C to stop the server');
  console.log('Video streaming capabilities enabled');
  console.log('AI-based content moderation enabled');
});