import { useLocation, useNavigate } from 'react-router-dom';

export default function Result() {
  const { state } = useLocation();
  const nav = useNavigate();
  const score = state?.score ?? 0;

  return (
    <div style={{
      padding: 20,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#333' }}>Your Score: <span style={{ color: '#28a745' }}>{score}/10</span></h2>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => nav('/quiz')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retake Quiz
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            nav('/');
          }}
          style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
