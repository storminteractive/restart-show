const readline = require('readline');
const WebSocket = require('ws');
const { lwt } = require('./lib/common/logger');
const { WebSocketClient } = require('./lib/control-board/wsClient');
const { SerialPort } = require('serialport');

const { RELAY_COM_PORT_NAME, BUTTON_COM_PORT_NAME } = require('./lib/config');

// Connect to the WebSocket server

const endShowEvent = () => {
    lwt('Show has finished')
}

const url = 'ws://localhost:3000/?command-app';
const wsClient = new WebSocketClient(url,endShowEvent);

const doorCloseDelaySeconds = 3;

// Setup serial ports
const relayComPort = new SerialPort({
    path: RELAY_COM_PORT_NAME, // Updated to use 'path' instead of directly passing the port name
    baudRate: 9600
});

const buttonComPort = new SerialPort({
    path: BUTTON_COM_PORT_NAME, // Updated to use 'path' instead of directly passing the port name
    baudRate: 9600
});

// Handle serial port errors
relayComPort.on('error', (err) => {
    console.error('Relay Serial port error: ', err.message);
});

buttonComPort.on('error', (err) => {
    console.error('Button Serial port error: ', err.message);
});


// Function to send data to serial port
function sendToSerial(data) {
    relayComPort.write(data, (err) => {
        if (err) { return console.log('Error on write: ', err.message); }
        console.log('OK');
    });
}

const openDoor = () => { lwt('Opening door - enabling relay...'); sendToSerial('1'); }
const closeDoor = () => { lwt('Closing door - disabling relay...'); sendToSerial('0'); }

// Listen for data on buttonComPort
buttonComPort.on('data', (data) => {
    if (data.toString().trim() === '1') {
        lwt('Button is pressed');
        lwt(wsClient.sendCommand({ 'action': 'show' })?'Show command sent successfully':'Show Command send failed...');

        // setTimeout(() => {
        //     openDoor();
        // }, doorCloseDelaySeconds * 1000);
        // setTimeout(() => {
        //     openDoor();
        // }, doorCloseDelaySeconds * 1000);

        // lwt(wsClient.sendCommand({ 'action': 'show' })?'Command sent successfully':'Command send failed...');
    }
});

// Create a readline interface to listen for keypresses
const rl = readline.createInterface({
    input: process.stdin,
    terminal: true
});

openDoor();
setTimeout(() => {
    closeDoor();
}, doorCloseDelaySeconds * 1000);

let instructions = `
Press "1" followed by ENTER to send the "show" command,
Press "2" followed by ENTER to send the "skip" command,
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
            lwt(wsClient.sendCommand({ 'action': 'skip' })?'Command sent successfully':'Skip Command send failed...');
            break;
        case '3':
            openDoor();
            break;
        case '4':
            closeDoor();
            break;
        case '5':
            process.exit();
            break;
        default:
            console.log(instructions);
    }
});
