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
      const [ rawPayload, body = '' ] = this.payload.split('\n');

      this.payload  = deserialize( rawPayload );
      this.body     = body;

      const { headers, payload, raw } = this;
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
