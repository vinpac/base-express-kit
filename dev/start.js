const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const clearConsole = require('../server/lib/clearConsole')
const webpackConfig = require('./webpack.config')
const webpackDevMiddleware = require("../server/middlewares/webpack-dev")
const webpackHotMiddleware = require("../server/middlewares/webpack-hmr")
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const compiler = webpack(webpackConfig)

compiler.plugin('invalid', function() {
  clearConsole()
  console.log('Compiling...')
})

// "done" event fires when Webpack has finished recompiling the bundle.
// Whether or not you have warnings or errors, you will get this event.
compiler.plugin('done', function(stats) {
  clearConsole()

  // We have switched off the default Webpack output in WebpackDevServer
  // options so we are going to "massage" the warnings and errors and present
  // them in a readable focused way.
  const messages = formatWebpackMessages(stats.toJson({}, true))
  if (!messages.errors.length && !messages.warnings.length) {
    console.log(chalk.green('Compiled successfully!'))
    console.log()
    console.log('The app is running at:')
    console.log()
    console.log('  ' + chalk.cyan(config.server_protocol + '://' + config.server_host + ':' + config.server_port + '/'))
    console.log()
    console.log('Note that the development build is not optimized.')
    console.log('To create a production build, use ' + chalk.cyan('npm run build') + '.')
    console.log()
  }

  // If errors exist, only show errors.
  if (messages.errors.length) {
    console.log(chalk.red('Failed to compile.'))
    console.log()
    messages.errors.forEach(message => {
      console.log(message)
      console.log()
    })
    return
  }

  // Show warnings if no errors were found.
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.'))
    console.log()
    messages.warnings.forEach(message => {
      console.log(message)
      console.log()
    })
    // Teach some ESLint tricks.
    console.log('You may use special comments to disable some warnings.')
    console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.')
    console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.')
  }
})

module.exports = function(app) {
  console.log('Starting webpack dev Server.')
  app.use(webpackDevMiddleware(compiler, webpackConfig.output.publicPath))
  app.use(webpackHotMiddleware(compiler))
}
