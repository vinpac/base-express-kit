const config = require("../config")
const app = require("./app")
const http = require("http")
const chalk = require('chalk')
const clearConsole = require('./lib/clearConsole')
const server = http.createServer(app)

if (config.globals.__PROD__) {
  run(config.server_port)
} else {
  const detect = require('detect-port')
  const prompt = require('react-dev-utils/prompt')

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
}

function run(port) {
  const server_url = config.server_protocol + '://'
    + config.server_host
    + ':' + port

  server.listen(port)

  server.on('listening', function() {
    clearConsole()
    if (process.env.DEV_SERVER) {
      console.log('$DEV_SERVER_START:'+config.server_host+':'+config.server_port+';\n')
    }
    console.log('The server is running at:')
    console.log('\n\t' + chalk.cyan(server_url) + '\n')

    if (!config.globals.__PROD__) {
      console.log('Note that the development build is not optimized.')
    }

    if (config.globals.__DEV__ && config.server_open_browser) {
      require('react-dev-utils/openBrowser')(server_url)
    }
  })
}
