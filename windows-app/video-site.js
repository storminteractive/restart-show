// app.js
const express = require('express');
const http = require('http');
const path = require('path');
const { lwt } = require('./lib/common/logger');
const { SITE_PORT } = require('./lib/config');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

// Serve a placeholder for favicon.ico requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();  // No Content response
});

server.listen(SITE_PORT, () => {
    lwt('Server is listening on port '+SITE_PORT);
});
