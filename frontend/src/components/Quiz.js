import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const [qs, setQs] = useState([]);
  const [ans, setAns] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return nav('/');
    API.post('/quiz/get-questions', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setQs(res.data))
      .catch(() => nav('/'));
  }, []);

  const submit = async () => {
    const payload = Object.entries(ans).map(([q, a]) => ({ q, answer: a }));
    const { data } = await API.post(
      '/quiz/submit',
      { answers: payload },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    nav('/result', { state: { score: data.score } });
  };

  return (
    <div>
      <h2>Quiz</h2>
      {qs.map(q => (
        <div key={q._id}>
          <p>{q.question}</p>
          {q.options.map(o => (
            <label key={o}>
              <input
                type="radio"
                name={q._id}
                value={o}
                checked={ans[q._id] === o}
                onChange={() => setAns(a => ({ ...a, [q._id]: o }))}
              />
              {o}
            </label>
          ))}
        </div>
      ))}
      <button disabled={Object.keys(ans).length !== qs.length} onClick={submit}>
        Submit
      </button>
    </div>
  );
}
