// wsClient.js
// Wrapper class for WebSocket facilitating reconnections and error handling on sending commands
//
// Example usage: 
// const { WebSocketClient } = require('./wsClient');
// const url = 'ws://localhost:3000/?command-app';
// const wsClient = new WebSocketClient(url);
// wsClient.sendCommand({ 'action': 'show' });

const { lwt } = require('./logger');
const WebSocket = require('ws');

class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.connectionInterval = 2000; // 2 seconds
        this.retryTimeout = null;
        this.ws = null;
        this.connect();
    }

    connect() {
        lwt('Connecting to socket server: '+this.url);
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            lwt('Connected to the primary app');
            lwt('Press "1" to send the "show" command and "2" to send the "skip" command.');
            clearTimeout(this.retryTimeout); // Clear the retry timeout if the connection is successful
        });

        this.ws.on('message', (data) => {
            lwt('Received message: %s', data);
        });

        this.ws.on('close', () => {
            lwt('Disconnected from the primary app');
            this.retryConnection(); // Retry connection when disconnected
        });

        this.ws.on('error', () => {
            lwt('Error occurred, trying to reconnect...');
            this.ws.close(); // Ensure WebSocket is closed on error
        });
    }

    retryConnection() {
        this.retryTimeout = setTimeout(() => {
            lwt('Retrying connection...');
            this.connect();
        }, this.connectionInterval);
    }

    sendCommand(command) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(command));
            lwt('Sent command:', command);
            return true; 
        } else {
            lwt('Cannot send command - connection is not open...');
            return false; 
        }
    }
}

module.exports = { WebSocketClient };