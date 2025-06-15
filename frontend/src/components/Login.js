import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const nav = useNavigate();

  const login = async () => {
    if (!username) return alert('Enter your name');
    try {
      const { data } = await API.post('/auth/login', { username });
      localStorage.setItem('token', data.token);
      nav('/quiz');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter your name"
        style={{ padding: 8, marginRight: 10 }}
      />
      <button onClick={login}>Start Quiz</button>
    </div>
  );
}
