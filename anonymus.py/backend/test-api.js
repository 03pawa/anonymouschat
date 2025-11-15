// Test script for our simple server API
const http = require('http');

// Test registration
const registerData = JSON.stringify({
  interests: 'technology, music',
  education: 'bachelor'
});

const registerOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

const registerReq = http.request(registerOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Registration Response:');
    console.log(data);
    
    // Try to parse the response to get userId
    try {
      const response = JSON.parse(data);
      if (response.userId) {
        // Test getting user info
        const getUserOptions = {
          hostname: 'localhost',
          port: 3001,
          path: `/api/user/${response.userId}`,
          method: 'GET'
        };
        
        const getUserReq = http.request(getUserOptions, (res) => {
          let userData = '';
          
          res.on('data', (chunk) => {
            userData += chunk;
          });
          
          res.on('end', () => {
            console.log('\nUser Info Response:');
            console.log(userData);
          });
        });
        
        getUserReq.on('error', (error) => {
          console.error('Error getting user info:', error);
        });
        
        getUserReq.end();
      }
    } catch (error) {
      console.error('Error parsing registration response:', error);
    }
  });
});

registerReq.on('error', (error) => {
  console.error('Error registering user:', error);
});

registerReq.write(registerData);
registerReq.end();