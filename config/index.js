var config = require('./_base')

if (config.globals.__PROD__) {
  config = Object.assign(config, require('./_production')(config))
} else {
  config = Object.assign(config, require('./_development')(config))
}

module.exports = config
