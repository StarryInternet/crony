'use strict';

const Listener            = require('./listener.js');
const { EventEmitter }    = require('events');
const { stdin, stdout }   = process;
const emitter             = new EventEmitter();
const listener            = new Listener( stdin, stdout );

emitter.listen = listener.listen.bind( listener );

emitter.on = ( ev, fn ) => {
  listener.on( ev, ( ...args ) => fn( ...args ) );
  return emitter;
};

module.exports = emitter;
