const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const envKeys = require('./env.config').envKeys;

module.exports = {
  entry: './entry/client.js',
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules', 'source'],
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.join(__dirname, '../public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        sourceMap: true
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};
