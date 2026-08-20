import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import RunGraph from './RunGraph';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [nodeStatus, setNodeStatus] = useState({});

  useWebSocket('ws://localhost:4000', (event) => {
    setEvents((prev) => [event, ...prev].slice(0, 200));
    setNodeStatus((prev) => ({ ...prev, [event.agent]: event.status }));
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', color: '#eee', background: '#111', minHeight: '100vh' }}>
      <h1>Agent Observability Dashboard</h1>
      <p>{events.length} events received</p>

      <RunGraph nodeStatus={nodeStatus} />

      <h2 style={{ marginTop: '2rem' }}>Event Log</h2>
      <div>
        {events.map((e, i) => (
          <div key={i} style={{ padding: '0.5rem', borderBottom: '1px solid #333' }}>
            <span style={{ color: '#888' }}>{new Date(e.timestamp * 1000 || Date.now()).toLocaleTimeString()}</span>
            {' — '}
            <strong>{e.agent}</strong>
            {' → '}
            <span style={{
              color: e.status === 'completed' ? '#4ade80' :
                     e.status === 'failed' ? '#f87171' :
                     e.status === 'retrying' ? '#fbbf24' : '#60a5fa'
            }}>
              {e.status}
            </span>
            {' '}
            <span style={{ color: '#666' }}>run: {e.run_id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;