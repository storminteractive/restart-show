#include "Arduino.h"
#include <SoftwareSerial.h>
// wait for 1 or more bytes in Serial the buffer
// Good for reading 1 char, for more use while
#define WAIT while(Serial.available()<=0) {} 

void setup() {
  // initialize serial:
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW); 
}

String getSerialString(bool echo=true){
  char inChar=0;
  String inString = "";
  while(inChar!=13){ // or while (inchar!='\n')
   WAIT;
   inChar = Serial.read();
   if(echo) Serial.print(inChar);
   if((int)inChar==127){ // backspace
     if (inString.length()>0) inString=inString.substring(0,inString.length()-1);
   } else inString += inChar;
  }
  return inString;
}

void loop() {
  Serial.print("Serial ready send command: ");
  String fromSerial = getSerialString();

  float tmp;
  tmp = 1.6;
  String strTmp;
  strTmp = String(tmp);
  Serial.println();
  Serial.println("The float is: "+strTmp); 
 
  Serial.print("Enter pressed! Received: "); Serial.println(fromSerial);
  if(fromSerial.indexOf("get/data")>=0) Serial.println("Also received data request");
  digitalWrite(13, HIGH); // Turn on embedded LED
  delay(2000);
  digitalWrite(13, LOW); // Turn off embedded LED
}



