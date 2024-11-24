const readline = require('readline');
const WebSocket = require('ws');
const { lwt } = require('./logger');
const { WebSocketClient } = require('./wsClient');

// Connect to the WebSocket server
const url = 'ws://localhost:3000/?command-app';
const wsClient = new WebSocketClient(url);

// Create a readline interface to listen for keypresses
const rl = readline.createInterface({
    input: process.stdin,
    terminal: true
});

// Listen for keypresses to send commands
rl.on('line', (input) => {
    switch (input.trim()) {
        case '1':
            lwt(wsClient.sendCommand({ 'action': 'show' })?'Command sent successfully':'Command send failed...');
            break;
        case '2':
            lwt(wsClient.sendCommand({ 'action': 'skip' })?'Command sent successfully':'Command send failed...');
            break;
        default:
            console.log('Invalid input. Press "1" for "show" or "2" for "skip".');
    }
});
