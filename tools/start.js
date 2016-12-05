const runServer = require('./runServer');
const Watchpack = require('watchpack');
const { globals, paths } = require('../config');
const { __DEV__ } = globals

if (__DEV__) {

  const wp = new Watchpack({
    ignored: /node_modules/,
  })

  wp.watch([], [paths.server()], Date.now());
  wp.on('change', () => {
    runServer()
  })
}

runServer()
