import { useEffect, useRef } from 'react';

export function useWebSocket(url, onEvent) {
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);
      onEvent(event);
    };
    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket disconnected');

    return () => ws.close();
  }, [url]);
}