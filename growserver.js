/*
nodemon growserver.js simulation -f logs/1586675408917-raw.log -i 500
*/

/*jshint esversion: 8 */ 

"use strict";

const session = require("./session.js");
const stream = require ("./stream.js");
const express = require('express');
const app = express();
const fs = require('fs');
const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');


let com = require('./command.js');
const argv = com.argv;


/********************************************main********************************************** */

//Web Server stuff
app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/',function (req, res) {
  res.sendFile( __dirname + "/public/" + "index.htm" );
});

app.get('/value', function (req, res) {
  res.setHeader('Content-Type','application/json');
  res.send(JSON.stringify(myStream.getStreamValue()));
});

app.get('/save', function (req, res) {
  saveSession();
  res.send("Session saved.");
});

app.get('/reset', function (req, res) {
  resetSession();
  res.send("Session has been reset!");
});

app.get('/session/:id?', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let s = new session.savedSessions();
  if (req.params.id) {
    res.send( await s.getSessionById(req.params.id));
  } else {
    res.send(await s.getSessions());
  }
});



/****************************************************** */

//Waterrower data streams & session
let mySession = new session.rowingSession();
let myStream = new stream.stream();
//import { getStreamValue, readStream } from './mystream';

if (argv._.includes('simulation')) {
  console.log("Simulation mode...");
  console.log(argv.file);

  var reader = fs.createReadStream (argv.file,{fd:null,encoding:'latin1'});
  reader.on ('readable', getbyte);

  async function getbyte(){
    var chunk;
    while (null !== (chunk = reader.read(2) )) {
      processbuffer(chunk);
      await sleep(argv.interval);
    }
  }
}

if (argv._.includes('live')) {
  console.log("Live mode...");
  const port = new SerialPort('/dev/ttyUSB0', { baudRate: 1200});

  if (argv.log) {
    let logfile = 'logs/' + Date.now() + '-raw.log';
  }

  const parser = port.pipe(new ByteLength({length: 1}));
  parser.on('data', processbuffer);

}


/*********************************functions************************************** */

function processbuffer(data){
  try {
    let mybyte = data.toString('hex');
    myStream.readStream(mybyte);
    updateSession();
  } catch(err) {
    console.log(err);
  }
}

function logFile (data){
  appendFile( logfile, data, (err) => {
    if (err) throw err
  })
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

function updateSession(){
  mySession.values.push(myStream.getStreamValue());
}

function saveSession(){
  mySession.save();
}

function resetSession(){
  mySession.reset();
}


