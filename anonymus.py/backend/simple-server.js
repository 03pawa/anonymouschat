const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Serve the anonymous-chat.html file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, '../anonymous-chat.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  // Serve the test-api.html file
  else if (req.url === '/test-api.html') {
    fs.readFile(path.join(__dirname, '../test-api.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } 
  // Serve CSS files
  else if (req.url.match(/\.(css)$/)) {
    let filePath = '';
    if (req.url.startsWith('/src/')) {
      filePath = path.join(__dirname, '../frontend', req.url);
    } else {
      filePath = path.join(__dirname, '../frontend/src', req.url);
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  }
  // Serve JS files
  else if (req.url.match(/\.(js)$/)) {
    let filePath = '';
    if (req.url.startsWith('/src/')) {
      filePath = path.join(__dirname, '../frontend', req.url);
    } else {
      filePath = path.join(__dirname, '../frontend/src', req.url);
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
  }
  // API endpoints
  else if (req.url.startsWith('/api/')) {
    if (req.method === 'POST' && req.url === '/api/register') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          // Generate a random user ID
          const userId = 'user_' + Math.random().toString(36).substr(2, 9);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            userId: userId, 
            message: 'Registration successful' 
          }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  }
  // 404 for everything else
  else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
  console.log(`Access the application from other devices on the same network at: http://10.220.250.147:${PORT}`);
  console.log(`Server is accessible from any device on the network`);
  console.log(`To make this server accessible from anywhere on the internet, run: ssh -R 80:localhost:${PORT} nokey@localhost.run`);
});