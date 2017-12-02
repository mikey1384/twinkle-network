const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './entry/client.js',
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
        exclude: [/node_modules/, /react-onclickoutside/],
        loader: 'babel-loader'
      },
      {
        test: /\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[hash]-[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({cache: false}),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
