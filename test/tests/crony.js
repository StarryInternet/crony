'use strict';

const assert            = require('chai').assert;
const expect            = require('chai').expect;
const Listener          = require('../../lib/listener');
const createSandbox     = require('../helpers/sandbox');

function getModule() {
  return require('rewire')('../../lib/crony');
}

describe( 'crony', () => {

  const sandbox = createSandbox();

  it( 'should export an instance of Listener', () => {
    let crony = getModule();
    assert.instanceOf( crony, Listener );
  });

  it( 'should have properties for stdin and stdout', () => {
    let crony = getModule();
    expect( crony.in ).to.eql( process.stdin );
    expect( crony.out ).to.eql( process.stdout );
  });

});
