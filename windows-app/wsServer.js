// Example usage: 
// const { wsServerHandleConnection } = require('./wsServer');
// wss.on('connection', handleConnection);

const { lwt } = require('./logger');
const { swapVideo } = require('./actions');

let websiteSock = null; 
let commandSock = null;

const displaySocketStatus = () => {
    lwt('--- Socket status ---');
    lwt('Website socket: ' + (websiteSock !== null ? 'connected' : 'disconnected'));
    lwt('Command socket: ' + (commandSock !== null ? 'connected' : 'disconnected'));
    lwt('---------------------');
}

const wsServerHandleConnection = (ws, req) => {
    lwt('Client connected (url: ' + req.url + ')');

    if (req.url === '/?website') {
        lwt('Setting website socket');
        websiteSock = ws;
    } else if (req.url === '/?command-app') {
        lwt('Setting command socket');
        commandSock = ws;
    }

    displaySocketStatus();

    ws.on('message', (message) => {

        let commandJson;

        try {
            commandJson = JSON.parse(message);
            lwt('Received command:', commandJson);                
        } catch (error) {
            lwt('Error parsing JSON:', error);
            return;
        }

        if (commandJson.action === 'show') {
            lwt('Received "show" command, sending "swap-video" message to client');
            swapVideo(websiteSock);
        }

        if (commandJson.action === 'skip') {
            lwt('Skip command received');
        }

    });

    ws.on('close', () => {
        lwt('Client disconnected');

        if (ws === websiteSock) {
            lwt('Website socket disconnected');
            websiteSock = null;
        } else if (ws === commandSock) {
            lwt('Command socket disconnected');
            commandSock = null;
        }

        displaySocketStatus();
    });

    ws.on('error', () => {
        lwt('Error occurred');
    });
}

module.exports = { wsServerHandleConnection };