// Simple test to verify server.js syntax
try {
  require('./server.js');
  console.log('Server code syntax is correct');
} catch (error) {
  console.error('Syntax error in server.js:', error.message);
}