var WebpackDevMiddleware = require("webpack-dev-middleware");;
var config = require('../../config');

var paths = config.paths

module.exports = function (compiler, publicPath) {
  console.log('Enable webpack dev middleware.')

  var middleware = WebpackDevMiddleware(compiler, {
    clientLogLevel: 'none',
    contentBase: paths.public(),
    publicPath: publicPath,
    hot: true,
    quiet: true,
    https: config.server_protocol === "https",
    watchOptions: {
      ignored: /node_modules/
    }
  })

  return middleware
}
