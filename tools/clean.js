const config = require('../config')
const chalk = require('chalk')
const rimrafSync = require('rimraf').sync;

rimrafSync(config.paths.build('*'))
console.log(chalk.green('App cleaned'))
