var path = require('path');
var config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_build  : '.build',
  dir_public : 'public',
  dir_server : 'server',
  // ----------------------------------
  // App Configuration
  // ----------------------------------
  app_entry: 'index.js',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_port: process.env.PORT || 3000,
  server_host: process.env.HOST || 'localhost',
  server_protocol: process.env.HTTPS === 'true' ? "https" : "http",
  server_preserve_log: false,
  server_open_browser: !process.argv.includes('--no-browser')
}

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env),
    'API_URL': "'/api'"
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__DEBUG__'    : config.env === 'development',
  '__DEBUG_NEW_WINDOW__' : false,
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
}

var paths = (function() {
  var resolve = path.resolve

  var base = resolve.bind(resolve, config.path_base)

  return {
    base   : base,
    client : base.bind(resolve, config.dir_client),
    build  : base.bind(resolve, config.dir_build),
    server : base.bind(resolve, config.dir_server),
    public : base.bind(resolve, config.dir_public),
    tools  : base.bind(resolve, 'tools'),
  }
})();

config.paths = paths

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(function(p) {
    return paths.base(p)
  });


// Compiler configuration
config.compiler = {
  entry: paths.client(config.app_entry),
  build: paths.base(config.dir_build),
  publicPath: '/',
  nodePaths: nodePaths
}

process.env.NODE_ENV = config.env
module.exports = config
