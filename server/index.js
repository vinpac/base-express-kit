const config = require("../config")
const app = require("./app")
const http = require("http")
const chalk = require('chalk')
const clearConsole = require('./lib/clearConsole')
const openBrowser = require('react-dev-utils/openBrowser')
const detect = require('detect-port')
const prompt = require('react-dev-utils/prompt')

const server = http.createServer(app)

function run(port) {
  const server_url = config.server_protocol + '://'
    + config.server_host
    + ':' + port

  server.listen(port)

  server.on('listening', function() {
    clearConsole()
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
    run(port)
    return
  }

  clearConsole()
  const question =
    chalk.yellow('Something is already running on port ' + config.server_port + '.') +
    '\n\nWould you like to run the app on another port instead?'

  prompt(question, true).then(shouldChangePort => {
    if (shouldChangePort) {
      run(port)
    }
  })
})
