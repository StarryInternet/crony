'use strict';

const Listener            = require('./listener.js');
const { stdin, stdout }   = process;

module.exports = new Listener( stdin, stdout );
