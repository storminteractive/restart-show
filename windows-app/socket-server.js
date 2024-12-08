// app.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { lwt } = require('./lib/common/logger');
const { wsServerHandleConnection } = require('./lib/socket-server/wsServer');
const { SOCKET_SERVER_PORT, SITE_PORT } = require('./lib/config');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', wsServerHandleConnection);

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();  // No Content response
});

app.get('/', (req, res) => {
    res.send(`Socket server listening on port ${SOCKET_SERVER_PORT}. Please use video site address at <a href="http://localhost:${SITE_PORT}">http://localhost:${SITE_PORT}</a>`);
});

server.listen(SOCKET_SERVER_PORT, () => {
    lwt('Server is listening on port '+SOCKET_SERVER_PORT);
});
