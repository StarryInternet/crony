'use strict';

function deserialize( str ) {
  return str.split(' ').reduce( ( prev, curr ) => {
    let [ key, val ] = curr.split(':');
    prev[ key ] = val;
    return prev;
  }, {} );
}

function parseInput( raw ) {
  const lines                 = raw.split('\n');
  const length                = lines.length;
  const [ headers, payload ]  = lines.slice( 0, 2 ).map( deserialize );

  let body;
  if ( length > 2 ) {
    body = lines.slice( 2 ).join('\n');
  }

  return { headers, payload, body, raw };
}

module.exports = parseInput;
