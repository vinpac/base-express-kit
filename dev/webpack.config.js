const config = require('../config');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const paths = config.paths


const __DEV__ = config.globals.__DEV__
const __PROD__ = config.globals.__PROD__

const webpackConfig = {

  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?'
    + 'path=/__webpack_hmr&'
    + 'reload=true&'
    + 'timeout=20000',
    config.compiler.entry
  ],
  output: {
    path: config.compiler.build,
    // Add /* filename */ comments to generated require()s in the output
    // on developemnt.
    pathinfo: __DEV__,
    // On development it doesn't produce a real file.
    filename: 'static/js/bundle.js',
    // This is the URL that app is served from. Default is "/".
    publicPath: config.compiler.publicPath
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    fallback: config.compiler.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx', '']
  },
  module: {
    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.client(),
      }
    ],

    loaders: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.client(),
        loader: 'babel'
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json'
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ],
  },

  // We use PostCSS for autoprefixing only.
  postcss() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },

  plugins: [
    new webpack.DefinePlugin(config.globals),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: paths.server('views', 'index.hbs'),
      hash: false,
      filename: `views/index.hbs`,
      inject: 'body',
      alwaysWriteToDisk: true,
      minify: {
        collapseWhitespace: config.globals.__PROD__
      }
    }),
    new HtmlWebpackHarddiskPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.base('node_modules'))
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}

if (__PROD__) {
  require('./webpack.config.prod')(webpackConfig)
} else {
  // non-production style
  webpackConfig.module.loaders.push(
    {
      test: /\.scss$/,
      loader: 'style!css!postcss!sass'
    },
    {
      test: /\.css$/,
      loader: 'style!css?sourceMap&-minimize!postcss'
    }
  )
}

module.exports = webpackConfig;
