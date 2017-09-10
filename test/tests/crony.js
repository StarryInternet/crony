'use strict';

const assert            = require('chai').assert;
const expect            = require('chai').expect;
const { EventEmitter }  = require('events');
const Listener          = require('../../lib/listener');
const createSandbox     = require('../helpers/sandbox');

function getModule() {
  return require('rewire')('../../lib/crony');
}

describe( 'crony', () => {

  const sandbox = createSandbox();

  it( 'should export an encapsulated listener', () => {
    const crony     = getModule();
    const listener  = crony.__get__('listener');

    assert.instanceOf( listener, Listener );

    assert.isUndefined( crony.in );
    assert.isUndefined( crony.out );
    assert.isUndefined( crony.message );
    assert.isUndefined( crony.onData );
    assert.isUndefined( crony.onComplete );
    assert.isUndefined( crony.bindEvents );

    assert.isFunction( crony.on );
    assert.isFunction( crony.listen );
  });

  it( 'should export an instance of EventEmitter', () => {
    const crony = getModule();
    assert.instanceOf( crony, EventEmitter );
  });

  it( 'should proxy events to the encapsulated listener', done => {
    const crony     = getModule();
    const listener  = crony.__get__('listener');

    crony.on( 'event', arg => {
      assert.isTrue( arg );
      done();
    });

    listener.emit( 'event', true );
  });

});
