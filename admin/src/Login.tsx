import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Hardcoded credentials
    const hardcodedUsername = 'admin';
    const hardcodedPassword = 'password123';

    if (username === hardcodedUsername && password === hardcodedPassword) {
      onLoginSuccess();
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
        Login
      </button>
    </div>
  );
};

export default Login;
