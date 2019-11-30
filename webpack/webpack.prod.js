const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const envKeys = require('./env.config').envKeys;
const HtmlWebPackPlugin = require('html-webpack-plugin');

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
    path: path.resolve(__dirname, '../public'),
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
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'images/[name].[ext]'
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
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          }
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.HashedModuleIdsPlugin(),
    new HtmlWebPackPlugin({
      hash: true,
      filename: 'index.html',
      template: './template/index.html',
      favicon: './public/favicon.png'
    })
  ]
};
