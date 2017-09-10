'use strict';

const { EventEmitter }  = require('events');
const headerDelimeter   = /\n/;

function deserialize( str ) {
  return str.split(' ').reduce( ( prev, curr ) => {
    let [ key, val ] = curr.split(':');
    prev[ key ] = val;
    return prev;
  }, {} );
}

function hasNewline( str ) {
  return headerDelimeter.test( str );
}

class Message extends EventEmitter {

  constructor() {
    super();
    this.reset();
  }

  get hasHeaders() {
    return this.headers !== null;
  }

  push( data ) {
    this.raw += data;

    if ( !this.hasHeaders && hasNewline( this.raw ) ) {
      const [ rawHeaders ] = this.raw.split('\n');

      this.headers    = deserialize( rawHeaders );
      data            = this.raw.slice( rawHeaders.length + 1 );
    }

    if ( this.hasHeaders ) {
      this.payload += data;
    }

    if ( this.payload.length && this.payload.length >= this.headers.len ) {
      const [ rawPayload ] = this.payload.split('\n');

      this.body     = this.payload.slice( rawPayload.length + 1 );
      this.payload  = deserialize( rawPayload );

      const { headers, payload, raw, body } = this;
      this.emit( 'complete', { headers, payload, raw, body });
    }

  }

  reset() {
    this.headers      = null;
    this.payload      = '';
    this.body         = '';
    this.raw          = '';
  }

}

module.exports = Message;
