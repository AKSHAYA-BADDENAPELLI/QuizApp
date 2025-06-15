import { useLocation, useNavigate } from 'react-router-dom';

export default function Result() {
  const { state } = useLocation();
  const nav = useNavigate();
  const score = state?.score ?? 0;
  return (
    <div>
      <h2>Your Score: {score}</h2>
      <button onClick={() => nav('/quiz')}>Retake Quiz</button>
      <button onClick={() => { localStorage.removeItem('token'); nav('/'); }}>
        Logout
      </button>
    </div>
  );
}
