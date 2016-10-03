'use strict';

const assert            = require('chai').assert;
const sinon             = require('sinon');
const EventEmitter      = require('events').EventEmitter;
const noop              = () => {};
const message           = require('../mocks/message');
const ReadableStream    = require('stream').Readable;

function getModule() {
  return require('rewire')('../../lib/listener');
}

describe( 'listener', () => {

  describe( '#constructor()', () => {

    it( 'should be a function', () => {
      assert.isFunction( getModule() );
    });

    it( 'should subclass EventEmitter', () => {
      let Listener = getModule();
      let a = {}, b = {};
      let listener = new Listener( a, b );
      assert.instanceOf( listener, EventEmitter );
    });

    it( 'should set this.in and this.out', () => {
      let Listener = getModule();
      let a = {}, b = {};
      let listener = new Listener( a, b );
      assert.equal( listener.in, a, 'this.in not set correctly' );
      assert.equal( listener.out, b, 'this.out not set correctly' );
    });

  });

  describe( '#listen()', () => {

    it( 'should call resume input stream and set encoding', () => {
      let Listener = getModule();
      let resume = sinon.spy();
      let setEncoding = sinon.spy();
      let mock = {
        in: { resume, setEncoding, on: noop },
        out: { write: noop }
      };

      Listener.prototype.listen.call( mock );
      assert.isTrue( resume.called, 'stdin.resume() never called' );
      assert.isTrue( setEncoding.calledWith('utf8'), 'stdin.setEncoding() not called correctly' );
    });

    it( 'should listen to the input `data` event', () => {
      let Listener = getModule();
      let on = sinon.spy();
      let mock = {
        in: { resume: noop, setEncoding: noop, on },
        out: { write: noop }
      };

      Listener.prototype.listen.call( mock );
      assert.isTrue( on.calledWith('data'), 'never bound to the input data event' );
    });

    it( 'should bind onData to the `data` event', () => {
      let Listener = getModule();
      let ONDATA = Listener.__get__('ONDATA');
      let onData = sinon.spy();
      let mock = {
        in: new ReadableStream(),
        out: { write: noop },
        [ ONDATA ]: onData
      };

      Listener.prototype.listen.call( mock );
      mock.in.emit('data');
      assert.isTrue( onData.called );
    });

    it( 'should write READY to the output stream', () => {
      let Listener = getModule();
      let write = sinon.spy();
      let mock = {
        in: { resume: noop, setEncoding: noop, on: noop },
        out: { write }
      };

      Listener.prototype.listen.call( mock );
      assert.isTrue( write.calledWith('READY\n'), 'never wrote READY to output stream' );
    });

    it( 'should be idempotent', () => {
      let Listener = getModule();
      let resume = sinon.spy();
      let mock = {
        in: { resume, setEncoding: noop, on: noop },
        out: { write: noop }
      };

      Listener.prototype.listen.call( mock );
      Listener.prototype.listen.call( mock );
      assert.equal( resume.callCount, 1 );
    });

    it( 'should populate `listening` cache', () => {
      let Listener = getModule();
      let listening = Listener.__get__('listening');
      let mock = {
        in: { resume: noop, setEncoding: noop, on: noop },
        out: { write: noop }
      };

      Listener.prototype.listen.call( mock );
      assert.isTrue( listening.get( mock ) );
    });

  });

  describe( '#onData()', () => {

    it( 'should ackknowledge the event to the output stream', () => {
      let Listener = getModule();
      let ONDATA = Listener.__get__('ONDATA');
      let write = sinon.spy();
      let mock = {
        out: { write },
        emit: noop
      };

      Listener.prototype[ ONDATA ].call( mock, message );
      assert.isTrue( write.calledWith('RESULT 2\nOK') );
    });

    it( 'should let the output stream know its ready for more events', () => {
      let Listener = getModule();
      let ONDATA = Listener.__get__('ONDATA');
      let write = sinon.spy();
      let mock = {
        out: { write },
        emit: noop
      };

      Listener.prototype[ ONDATA ].call( mock, message );
      assert.isTrue( write.calledWith('READY\n') );
    });

    it( 'should parse the raw event string and emit events', () => {
      let Listener = getModule();
      let parse = Listener.__get__('parse');
      let ONDATA = Listener.__get__('ONDATA');
      let emit = sinon.spy();
      let mock = { out: { write: noop }, emit };
      let msg = parse( message );

      Listener.prototype[ ONDATA ].call( mock, message );
      assert.isTrue( emit.calledWith( 'PROCESS_STATE_RUNNING', msg ) );
      assert.isTrue( emit.calledWith( 'event', msg ) );
    });

  });

})
