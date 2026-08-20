const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();
const eventHistory = []; 
const MAX_HISTORY = 200;

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });
});

function broadcast(event) {
  const msg = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === 1) client.send(msg);
  }
}


app.post('/internal/events', (req, res) => {
  const event = req.body;
  console.log('Received event:', event);

  eventHistory.push(event);
  if (eventHistory.length > MAX_HISTORY) eventHistory.shift();

  broadcast(event);
  res.sendStatus(200);
});


app.get('/internal/history/:run_id', (req, res) => {
  const runEvents = eventHistory.filter(e => e.run_id === req.params.run_id);
  res.json(runEvents);
});

server.listen(4000, () => {
  console.log('Gateway listening on http://localhost:4000');
});