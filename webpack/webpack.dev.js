import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import prodCfg from './webpack.prod.config.js';
import { envKeys } from './env.config';

export default function devConfig(app) {
  const config = {
    ...prodCfg,
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    entry: ['webpack-hot-middleware/client', './entry/client'],
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'eslint-loader'
        },
        {
          test: /\.js$/,
          include: [/source/, /entry/],
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
      new webpack.NoEmitOnErrorsPlugin()
    ]
  };

  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: prodCfg.output.publicPath
    })
  );
  app.use(webpackHotMiddleware(compiler));
}
