import React, { useState, useEffect } from 'react';
import RegisterForm from './components/RegisterForm';
import ChatRoom from './components/ChatRoom';
import './App.css';
import './components/RegisterForm.css';
import './components/ChatRoom.css';

function App() {
  const [userId, setUserId] = useState(null);
  const [inChat, setInChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Check if user is already registered
    const storedUserId = localStorage.getItem('anonymousChatUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleRegister = (id) => {
    setUserId(id);
    localStorage.setItem('anonymousChatUserId', id);
  };

  const handleMatch = (sessionId) => {
    setInChat(true);
    setSessionId(sessionId);
  };

  const handleDisconnect = () => {
    setInChat(false);
    setSessionId(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Anonymous Chat Group</h1>
        <p>Connect with people who share similar interests</p>
      </header>
      
      <main className="app-main">
        {!userId ? (
          <RegisterForm onRegister={handleRegister} />
        ) : inChat ? (
          <ChatRoom 
            userId={userId} 
            sessionId={sessionId} 
            onDisconnect={handleDisconnect} 
          />
        ) : (
          <div className="waiting-room">
            <h2>Finding you a match...</h2>
            <p>Please wait while we connect you with someone who shares similar interests.</p>
            <button onClick={() => setUserId(null)}>Back to Registration</button>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Anonymous Chat Group. All interactions are monitored for safety.</p>
        <p>Illegal activities will result in account prohibition.</p>
      </footer>
    </div>
  );
}

export default App;