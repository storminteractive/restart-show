// app.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { lwt } = require('./logger');
const { wsServerHandleConnection } = require('./wsServer');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', wsServerHandleConnection);

// Serve a placeholder for favicon.ico requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();  // No Content response
});

server.listen(3000, () => {
    lwt('Server is listening on port 3000');
});
