const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const envKeys = require('./env.config').envKeys;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {
  entry: ['./app.js'],
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules', 'source'],
    extensions: ['.js', '.jsx']
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js'
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
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebPackPlugin({
      hash: true,
      filename: 'index.html',
      template: './public/index.html',
      favicon: './public/favicon.png'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['./public/css/slider.css', './public/css/styles.css'],
      append: false
    })
  ]
};
