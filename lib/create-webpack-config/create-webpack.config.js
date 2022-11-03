const path = require('path');

const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = (dir) => ({
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: path.join(dir, '.webpack'),
  },
  mode: 'development',
  target: 'node',
  plugins: [new IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        ],
      },
    ],
  },
});
