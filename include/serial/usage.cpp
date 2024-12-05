#include "StormSerial.h"
StormSerial ss = StormSerial(false,60,62); // message between < and >

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);  
}

void loop() {
  // put your main code here, to run repeatedly:
  if(ss.checkMessage()){
    Serial.println("Received: "+ss.readMessageAndClear());
  }
}
