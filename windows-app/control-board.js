const readline = require('readline');
const { lwt } = require('./lib/common/logger');
const { WebSocketClient } = require('./lib/control-board/wsClient');
const { ControlBoardActions } = require('./lib/control-board/ControlBoardActions');

// Create an instance of ControlBoardActions
const controlBoardActions = new ControlBoardActions();

// Connection to the WebSocket server
lwt('Connecting to the WebSocket server...');
const url = 'ws://localhost:3000/?command-app';
const wsClient = new WebSocketClient(url, controlBoardActions);

// Handle button press event
controlBoardActions.on('buttonPressed', () => {
    lwt('Button is pressed, executing buttonPortAction');
    wsClient.sendCommand({ 'action': 'show' });
});

// Create a readline interface for control and simmulations
const rl = readline.createInterface({
    input: process.stdin,
    terminal: true
});


let instructions = `
Press "1" followed by ENTER to send the "show" command,
Press "2" followed by ENTER to perform open delay close door sequence,
Press "3" followed by ENTER to open the door,
Press "4" followed by ENTER to close the door,
Press "5" to exit
`;
console.log(instructions);

// Listen for keypresses to send commands
rl.on('line', (input) => {
    switch (input.trim()) {
        case '1':
            lwt(wsClient.sendCommand({ 'action': 'show' })?'Show command sent successfully':'Show Command send failed...');
            break;
        case '2':
            controlBoardActions.openDelayCloseDoor();
            break;
        case '3':
            controlBoardActions.openDoor();
            break;
        case '4':
            controlBoardActions.closeDoor();
            break;
        case '5':
            process.exit();
            break;
        default:
            console.log(instructions);
    }
});
