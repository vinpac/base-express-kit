const redis = require('redis')
const clearConsole = require('../lib/clearConsole')

// Init redis client
const rclient = redis.createClient()
rclient.on('error', err => clearConsole() | console.log())

module.exports = rclient
