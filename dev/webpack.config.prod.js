const config = require('../config')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (webpackConfig) => {
  Object.assign(webpackConfig, {
    // This will override default webpackConfig
    devtool: 'source-map',
    entry: [ config.compiler.entry ],
    plugins: [
      new webpack.DefinePlugin(config.globals),
      new HtmlWebpackPlugin({
        inject: 'body',
        template: config.paths.server('views', 'index.hbs'),
        hash: false,
        filename: `views/index.hbs`,
        alwaysWriteToDisk: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new HtmlWebpackHarddiskPlugin(),
      // This helps ensure the builds are consistent if source hasn't changed:
      new webpack.optimize.OccurrenceOrderPlugin(),
      // Try to dedupe duplicated modules, if any:
      new webpack.optimize.DedupePlugin(),
      // Minify the code.
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      }),
      // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
      new ExtractTextPlugin('static/css/[name].[contenthash:8].css', {
        allChunks: true
      }),
    ]
  })

  // Override output
  Object.assign(webpackConfig.output, {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
  })

  webpackConfig.module.loaders.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('css?-minimize!postcss!sass')
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css?-autoprefixer!postcss')
    }
  )
}
