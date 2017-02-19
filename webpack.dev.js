import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import prodCfg from './webpack.prod.config.js'

export default function options(app) {
  const config = Object.assign({}, prodCfg, {
    devtool: 'eval-source-map',
    entry: [
      'webpack-hot-middleware/client.js',
      './entry/client.js'
    ],
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
            presets: [['es2015', {'modules': false}], 'react'],
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: options.devtool && (options.devtool.indexOf('sourcemap') >= 0 || options.devtool.indexOf('source-map') >= 0)
      })
    ],
    performance: {
      hints: 'warning'
    }
  })

  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, { noInfo: false }))
  app.use(webpackHotMiddleware(compiler))
}
