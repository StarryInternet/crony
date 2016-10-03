# crony

[ ![Codeship Status for StarryInternet/crony](https://app.codeship.com/projects/5c995790-6ba9-0134-8a4f-6efe74dd2a57/status?branch=master)](https://app.codeship.com/projects/177009)

Node.js library for implementing supervisord event listeners.

*Requires Node.js 4+*

### What?

[supervisord](http://supervisord.org/) implements an [event API](http://supervisord.org/events.html#event-listeners-and-event-notifications)
for listening to changes in state for the processes it manages. `crony` is an
EventEmitter that lets us do stuff with those events in JavaScript.

## Usage

```js
const crony = require('crony');

crony.on( 'event', ev => {
  // Global event handler

  // token set for the event headers
  console.log(`Headers: ${ ev.headers }`);

  // token set for the event payload
  console.log(`Payload: ${ ev.payload }`);

  // If there was an event body, we pass that along, otherwise its undefined
  console.log(`Body: ${ ev.body }`);

  // We also preserve the raw event string
  console.log(`Raw: ${ ev.raw }`);
});

// Additionally, we can also listen to specific events
crony.on( 'PROCESS_STATE_RUNNING', ev => {
  // ...
});

// Start listening for events
crony.listen();
```

## Development
```
# Install dependencies
npm install -g grunt-cli
npm install

# Run the tests
npm test
```
