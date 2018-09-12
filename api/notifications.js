import WebSocket from 'ws';

let wss = null;

function init(server) {
  wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    console.log('WS new connection');

    ws.on('message', (msg) => {
      console.log('WS received message', msg);
    });
  });
}

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Sending data...');
      client.send(JSON.stringify(data));
    }
  });
}

export { init, broadcast };
