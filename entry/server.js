import express from 'express'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router'
import createHistory from 'history/createMemoryHistory'
import {Provider} from 'react-redux'
import path from 'path'
import App from 'containers/App'
import createStoreWithHistory from './store'
global.regeneratorRuntime = require('regenerator-runtime/runtime')

const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('../webpack/webpack.dev').default(app)
}

const history = createHistory()
const store = createStoreWithHistory(history)

app.use(express.static(path.join(__dirname, '../public')))
app.use((req, res) => {
  res.end((function() {
    const ReactView = renderToString(
      <Provider store={store}>
        <StaticRouter context={{}} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    )
    return (
      `<!DOCTYPE html>
      <html>
        <head>
         <meta charset="utf-8">
         <title>Twinkle</title>
         <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
         <link rel="stylesheet" href="/css/bootstrap.min.css">
         <link rel="stylesheet" href="/css/theme.css">
         <link rel="stylesheet" href="/css/slider.css">
         <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <div id="react-view">${ReactView}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}
          </script>
          <script type="application/javascript" src="/main.js"></script>
        </body>
      </html>`
    )
  })())
})

export default app
