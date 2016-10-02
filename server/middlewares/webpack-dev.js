const WebpackDevMiddleware = require("webpack-dev-middleware")
const config = require('../../config')

module.exports = (compiler, publicPath) => {
  return WebpackDevMiddleware(compiler, {
    clientLogLevel: 'none',
    contentBase: config.paths.public(),
    publicPath: publicPath,
    hot: true,
    quiet: true,
    https: config.server_protocol === "https",
    watchOptions: {
      ignored: /node_modules/
    }
  })
}
