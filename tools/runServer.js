const chalk = require('chalk');
const clearConsole = require('../server/lib/clearConsole');
const paths = require('../config').paths;
const child_process = require('child_process');
const fs = require('fs');
let server;


const RUNNING_REGEXP = /\$DEV_SERVER_START:(.*?);/;
const runServer = (cb) => {
  let cbIsPending = !!cb;

  if (server) {
    clearConsole();
    console.log(chalk.yellow.bold('Restarting server...'))
    server.kill('SIGTERM');
  }

  server = child_process.spawn('node',
    [
      paths.server('index'),
      // Force color option
      '--color',
      // Disable browse on restarting
      server ? '--no-browser' : null
    ],
    // Options
    {
      env: Object.assign({
        NODE_ENV: 'development',
        DEV_SERVER: true,
        NPM_CONFIG_COLOR: 'always'
      }, process.env),
      silent: false,
    }
  )

  function onStdOut(data) {
    const match = data.toString('utf8').match(RUNNING_REGEXP);
    process.stdout.write(data);

    if (match) {
      server.stdout.removeListener('data', onStdOut);
      server.stdout.on('data', x => process.stdout.write(x));

      if (cb) {
        cbIsPending = false;
        cb(null, match[1]);
      }
    }
  }

  if (cbIsPending) {
    server.once('exit', (code, signal) => {
      if (cbIsPending) {
        throw new Error(`Server terminated unexpectedly with code: ${code} signal: ${signal}`);
      }
    });
  }

  server.stdout.on('data', onStdOut);
  server.stderr.on('data', x => process.stderr.write(x));

  return server
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM');
  }
});

module.exports = runServer
