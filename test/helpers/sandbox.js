'use strict';

const sinon = require('sinon');

module.exports = () => {
  const sandbox = sinon.sandbox.create();

  beforeEach( () => {
    sandbox.stub( console, 'error' );
    sandbox.stub( process.stdout, 'write' );
  });

  afterEach( () => sandbox.restore() );

  return sandbox;
};
