#include <Arduino.h>
#include "util.h"

#define RELAY_PIN 2
#define BUTTON_LED_PIN 12
// #define BUTTON_LED_PIN LED_BUILTIN // temporary
#define LED_PIN LED_BUILTIN // 13

bool blinking = false;
unsigned long previousMillis = 0;
const long interval = 300; // Interval at which to blink (milliseconds)

void enableRelay();
void disableRelay();

void enableRelay() {
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  Serial.println("Relay enabled");
}

void disableRelay() {
  digitalWrite(RELAY_PIN, HIGH);
  digitalWrite(LED_PIN, HIGH);
  Serial.println("Relay disabled");
}

void enableBlinking() {
  blinking = true;
  Serial.println("Blinking enabled");
}

void disableBlinking() {
  blinking = false;
  digitalWrite(BUTTON_LED_PIN, LOW);
  Serial.println("Blinking disabled");
}

void handleBlinking() {
  if (blinking) {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      // Toggle the LED state
      int ledState = digitalRead(BUTTON_LED_PIN);
      digitalWrite(BUTTON_LED_PIN, !ledState);
    }
  }
}

void handleSerialInput(char input) {
  switch (input) {
    case '0':
      disableRelay();
      break;
    case '1':
      enableRelay();
      break;
    case '2':
      enableBlinking();
      break;
    case '3':
      disableBlinking();
      break;
    default:
      break;
  }
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    char receivedByte = Serial.read();
    handleSerialInput(receivedByte);
  }
  handleBlinking();
}
