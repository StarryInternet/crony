'use strict';

const Message             = require('./message');
const EventEmitter        = require('events').EventEmitter;
const listening           = new Map();

// supervisord message strings
const ACKNOWLEDGED        = 'RESULT 2\nOK';
const READY               = 'READY\n';

// for Listener#onData() method pseudo-privacy
const ON_DATA      = Symbol('onData');
const ON_COMPLETE  = Symbol('onComplete');

class Listener extends EventEmitter {

  constructor( stdin, stdout ) {
    super();

    this.in           = stdin;
    this.out          = stdout;
    this.message      = new Message();
  }

  listen() {
    if ( listening.get( this ) ) {
      return;
    }

    this.in.resume();
    this.in.setEncoding('utf8');

    this.in.on( 'data', data => {
      Reflect.apply( this[ ON_DATA ], this, [ data ] );
    });

    this.out.write( READY );

    listening.set( this, true );
  }

  [ ON_DATA ]( data ) {
    let msg = this.message;

    if ( msg.raw.length === 0 ) {
      msg.on( 'complete', msg => {
        Reflect.apply( this[ ON_COMPLETE ], this, [ msg ] );
      });
    }

    msg.push( data );
  }

  [ ON_COMPLETE ]( msg ) {
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
