const readline = require('readline');
const WebSocket = require('ws');
const { lwt } = require('./logger');
const { WebSocketClient } = require('./wsClient');
const { SerialPort } = require('serialport');

// Connect to the WebSocket server

// const url = 'ws://localhost:3000/?command-app';
// const wsClient = new WebSocketClient(url);
const buttonComPortName = 'COM3';
const relayComPortName = 'COM4';

// Setup serial ports
const relayComPort = new SerialPort({
    path: relayComPortName, // Updated to use 'path' instead of directly passing the port name
    baudRate: 9600
});

const buttonComPort = new SerialPort({
    path: buttonComPortName, // Updated to use 'path' instead of directly passing the port name
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

const enableRelay = () => { console.log('Enabling relay...'); sendToSerial('1'); }
const disableRelay = () => { console.log('Disabling relay...'); sendToSerial('0'); }

// Listen for data on buttonComPort
buttonComPort.on('data', (data) => {
    if (data.toString().trim() === '1') {
        console.log('Button is pressed');
        lwt(wsClient.sendCommand({ 'action': 'show' })?'Command sent successfully':'Command send failed...');
    }
});

// Create a readline interface to listen for keypresses
const rl = readline.createInterface({
    input: process.stdin,
    terminal: true
});

let instructions = `Press "1" followed by ENTER to send the "show" command and "2" followed by ENTER to send the "skip" command, 3 followed by ENTER to send relay on, 4 followed by ENTER to send relay off, 5 to exit`;

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
            enableRelay();
            break;
        case '4':
            disableRelay();
            break;
        case '5':
            process.exit();
            break;
        default:
            console.log(instructions);
    }
});
