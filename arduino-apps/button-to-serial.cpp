#include <Arduino.h>

const byte buttonPin = 12; // Pin where the button is connected
const byte ledPin = LED_BUILTIN; // Built-in LED pin

bool blinking = false; // Variable to store the blinking state

void setup() {
    pinMode(buttonPin, INPUT_PULLUP); // Set button pin as input with internal pull-up resistor
    pinMode(ledPin, OUTPUT); // Set LED pin as output
    Serial.begin(9600); // Start serial communication at 115200 baud rate
}

void loop() {
    static int lastButtonState = HIGH; // Variable to store the last button state
    int buttonState = digitalRead(buttonPin); // Read the state of the button

    if (buttonState != lastButtonState) { // Check if the button state has changed
      if (buttonState == LOW) { // Check if the button is pressed
        Serial.print('1'); // Send '1' over serial
        digitalWrite(ledPin, HIGH); // Turn on the LED
      } else {
        Serial.println('0'); // Send '0' over serial
        digitalWrite(ledPin, LOW); // Turn off the LED
      }
      lastButtonState = buttonState; // Update the last button state
    }

    delay(50); // Small delay to debounce the button
}