import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { renderStylesToString } from 'emotion-server'
import { StaticRouter } from 'react-router'
import createHistory from 'history/createMemoryHistory'
import { Provider } from 'react-redux'
import path from 'path'
import App from 'containers/App'
import createStoreWithHistory from './store'

const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('../webpack/webpack.dev').default(app)
}

const history = createHistory()
export const store = createStoreWithHistory(history)

app.use(express.static(path.join(__dirname, '../public')))
app.use((req, res) => {
  res.end(
    (function() {
      const ReactView = renderStylesToString(
        renderToString(
          <Provider store={store}>
            <StaticRouter context={{}} location={req.url}>
              <App />
            </StaticRouter>
          </Provider>
        )
      )
      return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
          <title>Twinkle</title>
          <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
          <link rel="stylesheet" href="/css/glyphicon.css">
          <link rel="stylesheet" href="/css/slider.css">
          <link rel="stylesheet" href="/css/styles.css">
          <script>  
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date(); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
          </script>
          <script>
            window.ga('create', 'UA-117103049-1', 'auto');
          </script>
        </head>
        <body>
          <div id="react-view">${ReactView}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}
          </script>
          <script type="application/javascript" src="/vendor.js"></script>
          <script type="application/javascript" src="/main.js"></script>
        </body>
      </html>`
    })()
  )
})

export default app
