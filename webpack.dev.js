import webpack from 'webpack';
import assign from 'object-assign';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import prodCfg from './webpack.prod.config.js';

Object.assign = assign;

export default function(app) {
  const config = Object.assign(prodCfg, {
    devtool: 'cheap-module-source-map',
    entry:   [
      'webpack-hot-middleware/client',
      './entry/client'
    ],
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint'
        }
      ],
      loaders: [
        {
          test: /\.js$/,
          include: [/shared/, /entry/],
          loader: 'babel',
          query: {
            cacheDirectory: true,
            presets: ['react', 'es2015'],
            plugins: [
              ['transform-object-rest-spread'],
              ['transform-class-properties'],
              ['transform-decorators-legacy'],
              [
                'react-transform',
                {
                  transforms: [
                    {
                      transform: 'react-transform-hmr',
                      imports: ['react'],
                      locals: ['module']
                    }
                  ]
                }
              ]
            ]
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  });

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true }));
  app.use(webpackHotMiddleware(compiler));
}
