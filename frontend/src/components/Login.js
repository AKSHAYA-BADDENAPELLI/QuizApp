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
    } catch {
      alert('Login error');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Name" />
      <button onClick={login}>Start Quiz</button>
    </div>
  );
}
