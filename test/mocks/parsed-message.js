module.exports = {
  "headers": {
    "ver": "3.0",
    "server": "supervisor",
    "serial": "2",
    "pool": "listen",
    "poolserial": "2",
    "eventname": "PROCESS_STATE_RUNNING",
    "len": "65"
  },
  "payload": {
    "processname": "listen",
    "groupname": "listen",
    "from_state": "STARTING",
    "pid": "46676"
  },
  "body": "foobar",
  "raw": "ver:3.0 server:supervisor serial:2 pool:listen poolserial:2 eventname:PROCESS_STATE_RUNNING len:65\nprocessname:listen groupname:listen from_state:STARTING pid:46676\nfoobar"
};
