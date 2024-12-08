#ifndef util_h
#define util_h
#include "Arduino.h"
//#define UTIL_DEBUG

void blinkLed(short int ledPin, short int howmany, short int delayMs);
bool buttonPressed(int pin);

#endif
