'use strict';

const assert            = require('chai').assert;
const expect            = require('chai').expect;
const message           = require('../mocks/message');
const parsedMessage     = require('../mocks/parsed-message');

function getModule() {
  return require('rewire')('../../lib/parse');
}

describe( 'parse', () => {

  describe( 'deserialize()', () => {

    it( 'should deserialize a space and colon delimited string', () => {
      let parse = getModule();
      let deserialize = parse.__get__('deserialize');

      let output = deserialize('foo:bar baz:bing');
      assert.equal( output.foo, 'bar' );
      assert.equal( output.baz, 'bing' );
    });

  });

  describe( 'parseInput()', () => {

    it( 'should parse a well formed supervisord event message', () => {
      let parse = getModule();
      let output = parse( message );
      expect( output ).to.eql( parsedMessage );
    });

    it( 'should not add `body` if none exists', () => {
      let parse = getModule();
      let output = parse( message.substr( 0, message.length - 7 ) );
      expect( output.body ).to.eql( undefined );
    });

  });

});
