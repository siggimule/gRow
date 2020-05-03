/*

http://www.waterrower.biz/en/accessories_software_spec.htm

Byte 0 Identification Number = FEh
Byte 1 Distance covered in last second in 0.1m units (as used by the distance display)

Byte 0 Identification Number = FFh
Byte 1 Current no of Strokes per minute (equal to the displayed stroke rate)
Byte 2 Current Speed in 0.1m/s units (equal to the displayed speed)

*/

/*jshint esversion: 8 */ 
"use strict";

class stream {
    constructor() {
        this.timestamp = 0;
        this.sessionStartDate = 0;
        this.sessionElapsedTime = 0;
        this.partialDistance = 0;
        this.totalDistance = 0;
        this.currentStrokerate = 0;
        this.totalStrokes = 0;
        this.currentSpeed = 0;

        this.lastByte = 0;
        this.secondByte = false;
    }

    getStreamValue(){
        return{
            timestamp: this.timestamp,
            sessionStartDate: this.sessionStartDate,
            sessionElapsedTime: this.timestamp - this.sessionStartDate,
            partialDistance: this.partialDistance,
            totalDistance: this.totalDistance,
            currentStrokerate: this.currentStrokerate,
            totalStrokes: this.totalStrokes,
            currentSpeed: this.currentSpeed

        };
    }

    readStream(myByte){

        let byteValue = parseInt(myByte, 16);
        this.timestamp = Date.now();

        if (this.lastByte === 'fe') {
            this.partialDistance = byteValue;
            this.totalDistance += this.partialDistance;
        }

        if (this.lastByte === 'ff') {
            this.currentStrokerate = byteValue;
            this.totalStrokes = this.totalStrokes + 1;
            this.secondByte = true;
        }

        if ((this.secondByte === true) && (this.lastByte !== 'ff')) {
            this.currentSpeed = byteValue;
            this.secondByte = false;

        }
        this.lastByte = myByte;

    }

}

module.exports = {
    stream: stream
}