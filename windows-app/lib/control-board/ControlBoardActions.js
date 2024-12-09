const EventEmitter = require('events');
const { SerialPort } = require("serialport");
const { lwt } = require("../common/logger");
const {
  DOOR_CLOSE_DELAY,
  RELAY_COM_PORT_NAME,
  BUTTON_COM_PORT_NAME,
  BAUD_RATE,
} = require("../config");

class ControlBoardActions extends EventEmitter {

  constructor(buttonPortAction) {
    super();
    this.setupSerialPorts();
    this.setupShowButtonAction();
    this.buttonPortAction = buttonPortAction;
  }

  setupShowButtonAction() {
    if (!this.buttonComPort) {
      lwt("Button serial port is not open - cannot setup on button action.");
      return;
    }

    this.buttonComPort.on("data", (data) => {
      if (data.toString().trim() === "1") {
        lwt('Button is pressed, emitting "buttonPressed" event');
        this.emit('buttonPressed');
      }
    });

  }

  setupSerialPorts() {
    // Const list serial ports available
    lwt("Checking for available serial ports");
    SerialPort.list().then((ports) => {
      ports.forEach((port) => {
        lwt(`Available serial port: `+port.path);
      });
    });

    // Setup serial ports
    lwt("Setting up relayComPort");
    this.relayComPort = new SerialPort({
      path: RELAY_COM_PORT_NAME, // Updated to use 'path' instead of directly passing the port name
      baudRate: BAUD_RATE,
    });

    this.relayComPort.on("error", (err) => {
      lwt("Relay Serial port error: ", err.message);
    });

    lwt("Setting up buttonComPort");
    this.buttonComPort = new SerialPort({
      path: BUTTON_COM_PORT_NAME, // Updated to use 'path' instead of directly passing the port name
      baudRate: BAUD_RATE,
    });

    this.buttonComPort.on("error", (err) => {
      lwt("Button Serial port error: ", err.message);
    });
  }

  sendToRelaySerial(data) {
    lwt("Sending data to relayComPort: " + data);
    if (!this.relayComPort) {
      lwt("Relay serial port is not open - won't execute.");
      return;
    }

    this.relayComPort.write(data, (err) => {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log("OK");
    });
  }

  openDoor() {
    lwt("Opening door - enabling relay...");
    this.sendToRelaySerial("1");
  }

  closeDoor() {
    lwt("Closing door - disabling relay...");
    this.sendToRelaySerial("0");
  }

  openDelayCloseDoor() {
    lwt(`Performing an open door sequence with ${DOOR_CLOSE_DELAY} seconds delay`);
    this.openDoor();
    setTimeout(() => {
      lwt(`Closing door after ${DOOR_CLOSE_DELAY} seconds`);
      this.closeDoor();
    }, DOOR_CLOSE_DELAY * 1000);
  }
}

module.exports = { ControlBoardActions };
