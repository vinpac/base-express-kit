var config = require("../config");
var app = require("./app");
var http = require("http");
var chalk = require('chalk');
var clearConsole = require('./lib/clearConsole');
var openBrowser = require('react-dev-utils/openBrowser');
var detect = require('detect-port');
var prompt = require('react-dev-utils/prompt');

var server = http.createServer(app);

function run(port) {
  var server_url = config.server_protocol + '://'
    + config.server_host
    + ':' + port;

  server.listen(port);

  server.on('listening', function() {
    clearConsole();
    console.log('The app is running at:')
    console.log('\n\t' + chalk.cyan(server_url) + '\n')
    console.log('Note that the development build is not optimized.')
    if (config.server_open_browser) {
      openBrowser(server_url)
    }
  })
}

detect(config.server_port).then(port => {
  if (port === config.server_port) {
    run(port);
    return;
  }

  clearConsole();
  var question =
    chalk.yellow('Something is already running on port ' + config.server_port + '.') +
    '\n\nWould you like to run the app on another port instead?';

  prompt(question, true).then(shouldChangePort => {
    if (shouldChangePort) {
      run(port);
    }
  });
});


1
