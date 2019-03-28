import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import prodCfg from './webpack.prod.js';
import { envKeys } from './env.config';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import history from 'connect-history-api-fallback';

export default function devConfig(app) {
  const config = {
    ...prodCfg,
    entry: ['webpack-hot-middleware/client', './app.js'],
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack']
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },
        {
          test: /\.js$/,
          include: [/source/, /app.js/],
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],
            cacheDirectory: true,
            plugins: [
              '@babel/plugin-transform-runtime',
              'react-hot-loader/babel'
            ]
          }
        },
        {
          test: /\.(png|jp(e*)g|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8000
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebPackPlugin({
        hash: true,
        filename: 'index.html',
        template: './public/index.html',
        favicon: './public/favicon.png'
      })
    ]
  };

  app.use(history());
  const compiler = webpack(config);
  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: prodCfg.output.publicPath
    })
  );
  app.use(webpackHotMiddleware(compiler));
  return app;
}
