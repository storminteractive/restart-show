#include "Arduino.h"
#include "util.h"

void blinkLed(short int ledPin, short int howmany, short int delayMs){
  int i;
  for (i=0;i<howmany;i++){
    digitalWrite(ledPin, LOW);
    delay(250);
    digitalWrite(ledPin, HIGH);
    delay(250);
  }
  delay(delayMs);
}

// button setup as INPUT_PULLUP, connect to GND, pinMode(buttonPin, INPUT_PULLUP);
// usage: if (readButton(buttonPin)) { ... }
bool buttonPressed(short int pin){
  const unsigned long debounceDelay = 50;
  static bool buttonState = HIGH;
  static unsigned long lastDebounceTime = 0;

  bool reading = digitalRead(pin);
  
  if (reading != buttonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    buttonState = reading;
  }

  return buttonState == LOW;
}
