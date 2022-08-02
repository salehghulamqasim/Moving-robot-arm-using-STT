#include <Servo.h>
Servo arm;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  arm.attach(9);
}

void loop() {
  // put your main code here, to run repeatedly:
  //if serial signal is greater than zero. means we are receiving signal then catch the word right or left and do as asked
  if(Serial.available()>0){
    String str= Serial.readString();
    if (str == 'Right'){
      arm.write(0);
      delay(100);
    }
    if( str == "Left"){
      arm.write(180);
      delay(100);
    }
      
    }
   
}
