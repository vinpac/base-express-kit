const chalk = require('chalk')
const config = require('../config')

const express = require('express')
const bodyParser = require("body-parser")
const favicon = require('serve-favicon')
const mustacheExpress = require('mustache-express')
const paths = config.paths
const app = new express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

if (config.globals.__DEV__) {
  require('../dev/start')(app)
}

// set favicon
// app.use(favicon(paths.public('favicon.png')))

// set port
app.set('port', config.server_port)

// Setting view engine as Handlebars
app.engine('.hbs', mustacheExpress())
app.set('view engine', '.hbs')
app.set('views', paths.build('views'))

// Disable caching on no-production
if (!config.globals.__PROD__) {
  app.set('view cache', false)
  app.use(express.static(paths.public()))
} else {
  app.use(express.static(paths.build('public'), { maxAge: 2592000000 }))
}

app.use('/', require('./routes')())
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('index', {
    jsonToClient: JSON.stringify({
      message: err.message,
      error: err
    })
  })
})

module.exports = app
