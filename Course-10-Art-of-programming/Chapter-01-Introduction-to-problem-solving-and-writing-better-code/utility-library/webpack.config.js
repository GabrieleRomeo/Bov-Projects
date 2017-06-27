const webpack = require('webpack');
const path = require('path');
const debug = process.env.NODE_ENV !== 'production';
const libraryName = 'uly';

module.exports = {

  devtool: debug ? 'inline-sourcemap' : null,
  entry: path.join(__dirname, 'src/uly.js'),
  output: {
    path: path.join(__dirname, 'build/'),
    filename: 'build.js',
    publicPath: '/build/',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },

  plugins: debug ? [] : [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],

};
