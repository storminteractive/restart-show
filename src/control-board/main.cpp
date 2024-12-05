#include <Arduino.h>
#include "util.h"

#define RELAY_PIN 2
#define LED_PIN LED_BUILTIN // 13

void enableRelay();
void disableRelay();

void enableRelay() {
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
}

void disableRelay() {
  digitalWrite(RELAY_PIN, HIGH);
  digitalWrite(LED_PIN, HIGH);
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if(Serial.available() > 0){
    char receivedByte = Serial.read();
    if(receivedByte == '1') {
      enableRelay();
    } else if(receivedByte == '0') {
      disableRelay();
    }
  }
}