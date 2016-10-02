const WebpackHotMiddleware = require("webpack-hot-middleware")

module.exports = (compiler) => {
  return WebpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    log: false,
    quiet: true,
    noInfo: true,
    heartbeat: 10 * 1000,
    reload: true
  })
}
