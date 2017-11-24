/* global __dirname, module, require */
const path = require('path');
const webpack = require('webpack');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');


// Addon directory
const dest_dir = path.resolve(__dirname, 'addon');


// Make manifest.json out of package.json information
const package = require('./package.json');
const manifest = require('./webext-manifest.json');
manifest.version = package.version;
manifest.description = package.description;
manifest.author = package.author.name;


module.exports = {
  target: 'web',
  node: false,

  entry: {
    'resources/dist/options': './src/browser/options.js'
  },

  output: {
    path: dest_dir,
    filename: '[name].js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new GenerateJsonPlugin('manifest.json', manifest, null, 2)
  ]
};
