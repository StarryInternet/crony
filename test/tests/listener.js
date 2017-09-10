'use strict';

const assert            = require('chai').assert;
const sinon             = require('sinon');
const EventEmitter      = require('events').EventEmitter;
const event             = require('../mocks/event');
const parsedEvent       = require('../mocks/parsed-event');
const createSandbox     = require('../helpers/sandbox');

function getModule() {
  return require('rewire')('../../lib/listener');
}

describe( 'listener', () => {

  const sandbox = createSandbox();

  it( 'should be able to parse a a byte at a time', done => {
    let Listener  = getModule();
    let stdin     = new EventEmitter();
    let listener  = new Listener( stdin, process.stdout );

    stdin.resume        = () => {};
    stdin.setEncoding   = () => {};

    listener.listen();
    listener.on( 'event', ev => {
      assert.deepEqual( ev, parsedEvent );
      done();
    });

    event.split('').forEach( val => stdin.emit( 'data', val ) );
  });

  it( 'should be able to parse arbitrary chunks of data', done => {
    let Listener  = getModule();
    let stdin     = new EventEmitter();
    let listener  = new Listener( stdin, process.stdout );

    stdin.resume        = () => {};
    stdin.setEncoding   = () => {};

    listener.listen();
    listener.on( 'event', ev => {
      assert.deepEqual( ev, parsedEvent );
      done();
    });

    let offsets = [
      { start: 0, end: 4 },
      { start: 4, end: 8 },
      { start: 8, end: 25 },
      { start: 25, end: 27 },
      { start: 27, end: 50 },
      { start: 50, end: 100 },
      { start: 100, end: event.length }
    ];

    let chunks = offsets.map( o => event.slice( o.start, o.end ) );
    chunks.forEach( val => stdin.emit( 'data', val ) );
  });

  it( 'should be able to parse a full payload', done => {
    let Listener  = getModule();
    let stdin     = new EventEmitter();
    let listener  = new Listener( stdin, process.stdout );

    stdin.resume        = () => {};
    stdin.setEncoding   = () => {};

    listener.listen();
    listener.on( 'event', ev => {
      assert.deepEqual( ev, parsedEvent );
      done();
    });

    stdin.emit( 'data', event );
  });

  it( 'should be able to parse multiple payloads', done => {
    let Listener  = getModule();
    let stdin     = new EventEmitter();
    let listener  = new Listener( stdin, process.stdout );
    let count     = 0;

    stdin.resume        = () => {};
    stdin.setEncoding   = () => {};

    listener.listen();
    listener.on( 'event', ev => {
      assert.deepEqual( ev, parsedEvent );
      if ( ++count === 4 ) {
        done();
      }
    });

    const emit = () => setTimeout( () => stdin.emit( 'data', event ), 0 );

    Array( 4 ).fill( 0 ).forEach( emit );
  });

  it( 'should catch errors on emitting events', done => {
    let Listener  = getModule();
    let stdin     = new EventEmitter();
    let listener  = new Listener( stdin, process.stdout );
    let count     = 0;

    stdin.resume        = () => {};
    stdin.setEncoding   = () => {};

    listener.listen();
    listener.on( 'event', ev => {
      count++;
      if ( count === 1 ) {
        throw new Error();
      }
      if ( count === 2 ) {
        assert.deepEqual( ev, parsedEvent );
        done();
      }
    });

    stdin.emit( 'data', event );
    stdin.emit( 'data', event );
  });

  it( 'should write RESULT 2 and OK to stdout on received messages', () => {
    let Listener  = getModule();
    let stdin     = new EventEmitter();
    let write     = sinon.stub();
    let listener  = new Listener( stdin, { write });

    stdin.resume        = () => {};
    stdin.setEncoding   = () => {};

    listener.listen();
    listener.listen();

    event.split('').forEach( val => stdin.emit( 'data', val ) );

    sinon.assert.calledWith( write, 'RESULT 2\nOK' );
    sinon.assert.calledWith( write, 'READY\n' );
  });

  describe( '#listen()', () => {

    it( 'should be idempotent', done => {
      let Listener  = getModule();
      let stdin     = new EventEmitter();
      let listener  = new Listener( stdin, process.stdout );

      stdin.resume        = () => {};
      stdin.setEncoding   = () => {};

      listener.listen();
      listener.listen();
      listener.on( 'event', ev => {
        assert.deepEqual( ev, parsedEvent );
        done();
      });

      event.split('').forEach( val => stdin.emit( 'data', val ) );
    });

    it( 'should write OK to stdout', () => {
      let Listener  = getModule();
      let stdin     = new EventEmitter();
      let write     = sinon.stub();
      let listener  = new Listener( stdin, { write });

      stdin.resume        = () => {};
      stdin.setEncoding   = () => {};

      listener.listen();
      listener.listen();

      sinon.assert.calledWith( write, 'READY\n' );
    });

  });

})
