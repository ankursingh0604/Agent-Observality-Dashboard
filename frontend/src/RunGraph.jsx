import { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, initialEdges } from './graphLayout';

const statusColor = {
  idle: '#333',
  started: '#3b82f6',
  completed: '#22c55e',
  failed: '#ef4444',
};

function RunGraph({ nodeStatus }) {
  const nodes = useMemo(() => {
    return initialNodes.map((n) => {
      const status = nodeStatus[n.id] || 'idle';

      const isRetryNode = n.id.startsWith('retry_');
      const border = isRetryNode && status !== 'idle' ? '#f59e0b' : statusColor[status];

      return {
        ...n,
        style: {
          background: '#111',
          color: '#eee',
          border: `2px solid ${border}`,
          borderRadius: 6,
          padding: 8,
          fontFamily: 'monospace',
          fontSize: 12,
          width: 160,
          textAlign: 'center',
        },
        data: { label: `${n.data.label}${status !== 'idle' ? ` (${status})` : ''}` },
      };
    });
  }, [nodeStatus]);

  return (
    <div style={{ height: 700, background: '#0a0a0a', borderRadius: 8, border: '1px solid #222' }}>
      <ReactFlow nodes={nodes} edges={initialEdges} fitView>
        <Background color="#222" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default RunGraph;