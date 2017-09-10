module.exports = {
  headers: {
    ver: '3.0',
    server: 'supervisor',
    serial: '21',
    pool: 'listener',
    poolserial: '10',
    eventname: 'PROCESS_COMMUNICATION_STDOUT',
    len: '85'
  },
  payload: { processname: 'foo', groupname: 'bar', pid: '123' },
  body: 'This is the data that was sent between the tags',
  raw: 'ver:3.0 server:supervisor serial:21 pool:listener poolserial:10 eventname:PROCESS_COMMUNICATION_STDOUT len:85\nprocessname:foo groupname:bar pid:123\nThis is the data that was sent between the tags'
};
