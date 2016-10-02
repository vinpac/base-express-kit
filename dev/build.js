const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const config = require('../config')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const paths = config.paths

require('./clean')
build()

function build() {
  copyPublicFolder();
  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      console.error('Failed to create a production build. Reason:');
      console.error(err.message || err);
      process.exit(1);
    }


    moveStaticIntoPublicFolder();
    console.log(chalk.green('Compiled successfully.'))
  })
}

function copyPublicFolder() {
  fs.copySync(paths.public(), paths.build('public'), {
    dereference: true
  });
}

function moveStaticIntoPublicFolder() {
  fs.move(paths.build('static'), paths.build('public', 'static'), err => {
    if (err) {
      throw err;
      process.exit(1)
    }
  })
}
