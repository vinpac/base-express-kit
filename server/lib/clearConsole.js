const config = require('../../config')

module.exports = function clearConsole() {
  if (!config.server_preserve_log) {
    process.stdout.write('\033[2J')
  } else {
    console.log('\n-----------------------------------------\n')
  }
}
