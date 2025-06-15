import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const [qs, setQs] = useState([]);
  const [ans, setAns] = useState({});
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return nav('/');

    API.post('/quiz/get-questions', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setQs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        alert('Session expired. Please login again.');
        nav('/');
      });
  }, []);

  const submit = async () => {
    const payload = Object.entries(ans).map(([q, a]) => ({ q, answer: a }));
    try {
      const { data } = await API.post(
        '/quiz/submit',
        { answers: payload },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      nav('/result', { state: { score: data.score } });
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit. Try again.');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading questions...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Quiz</h2>
      {qs.map((q, index) => (
        <div key={q._id} style={{ marginBottom: 20 }}>
          <p><strong>Q{index + 1}:</strong> {q.question}</p>
          {q.options.map(o => (
            <label key={o} style={{ display: 'block', marginLeft: 10 }}>
              <input
                type="radio"
                name={q._id}
                value={o}
                checked={ans[q._id] === o}
                onChange={() => setAns(a => ({ ...a, [q._id]: o }))}
              />
              {' '}{o}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={submit}
        disabled={Object.keys(ans).length !== qs.length}
        style={{
          padding: '8px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: 20
        }}
      >
        Submit
      </button>
    </div>
  );
}
