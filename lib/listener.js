'use strict';

const Message             = require('./message');
const EventEmitter        = require('events').EventEmitter;
const listening           = new Map();

// supervisord message strings
const ACKNOWLEDGED        = 'RESULT 2\nOK';
const READY               = 'READY\n';

class Listener extends EventEmitter {

  constructor( stdin, stdout ) {
    super();

    this.in           = stdin;
    this.out          = stdout;
    this.message      = new Message();

    this.bindEvents();
  }

  bindEvents() {
    this.message.on( 'complete', msg => {
      Reflect.apply( this.onComplete, this, [ msg ] );
    });
  }

  listen() {
    if ( listening.get( this ) ) {
      return;
    }

    this.in.resume();
    this.in.setEncoding('utf8');

    this.in.on( 'data', data => {
      Reflect.apply( this.onData, this, [ data ] );
    });

    this.out.write( READY );

    listening.set( this, true );
  }

  onData( data ) {
    this.message.push( data );
  }

  onComplete( msg ) {
    this.out.write( ACKNOWLEDGED );

    try {
      this.emit( 'event', msg );
      this.emit( msg.headers.eventname, msg );
    } catch ( err ) {
      console.error( err );
    }

    this.message.reset();
    this.out.write( READY );
  }

}

module.exports = Listener;
