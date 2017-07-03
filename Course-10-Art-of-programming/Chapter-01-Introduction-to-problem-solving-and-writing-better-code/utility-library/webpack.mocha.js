const path = require('path');
const merge = require('webpack-merge');
const glob = require("glob");

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: debug ? 'inline-sourcemap' : null,
  entry: glob.sync(path.join(__dirname, 'test/*.test.js')),
  output: {
    path: path.join(__dirname, 'test'),
    filename: 'tests-build.js',
    publicPath: '/test/'
  },

  module: {
    loaders: [
      { loader: 'babel-loader' },
    ],
  },
  devServer: {
    inline: true,
    port: 8081,
    open: true
  },

  plugins: debug ? [] : [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],

};

