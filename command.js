// https://github.com/yargs/yargs/blob/master/docs/advanced.md

//const yargs = require('yargs')

//module.exports.args = function (){

"use strict"
const yargs = require('yargs');


const argv = yargs
  .command('simulation', 'Simulation mode', {
        file: {
            description: 'Logfile to read',
            alias: 'f',
            type: 'string',
        },

        interval: {
          description: 'Reading interval',
          alias: 'i',
          type: 'integer',
      }
    })

    .command('live', 'Live mode', {
      log: {
          description: 'Logfile to write',
          alias: 'l',
          type: 'string',
      }
  })
    .help()
    .alias('help', 'h')
    .argv;

    exports.argv = argv;