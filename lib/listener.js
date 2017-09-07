'use strict';

const parse               = require('./parse');
const EventEmitter        = require('events').EventEmitter;
const listening           = new Map();

// supervisord message strings
const ACKNOWLEDGED        = 'RESULT 2\nOK';
const READY               = 'READY\n';

// for Listener#onData() method pseudo-privacy
const ONDATA = Symbol('onData');

class Listener extends EventEmitter {

  constructor( stdin, stdout ) {
    super();
    this.in         = stdin;
    this.out        = stdout;
  }

  listen() {
    if ( listening.get( this ) ) {
      return;
    }

    this.in.resume();
    this.in.setEncoding('utf8');
    this.in.on( 'data', data => this[ ONDATA ]( data ) );
    this.out.write( READY );

    listening.set( this, true );
  }

  [ ONDATA ]( data ) {

    let msg = parse( data );
    this.emit( 'event', msg );
    this.emit( msg.headers.eventname, msg );
    this.out.write( ACKNOWLEDGED );

    this.out.write( READY );
  }

}

module.exports = Listener;
