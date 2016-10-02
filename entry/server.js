import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {RouterContext, match} from 'react-router';
import createLocation from 'history/lib/createLocation';
import {Provider} from 'react-redux';
import path from 'path';
import {routes, store} from 'Root';
import {initActions} from 'redux/actions';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('../webpack.dev').default(app);
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  const location = createLocation(req.url);
  match({routes, location}, (err, redirectLocation, props) => {
    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!props) return res.status(404).end('Not found');
    store.dispatch(initActions(location))
      .then(() => res.end(renderView()))
      .catch(err => res.status(500).end(err.message))

    function renderView() {
      const view = (
        <Provider store={store}>
          <RouterContext {...props} />
        </Provider>
      )
      const ReactView = renderToString(view);
      return (
        `<!DOCTYPE html>
        <html>
          <head>
           <meta charset="utf-8">
           <title>Twinkle</title>
           <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
           <link rel="stylesheet" href="/css/bootstrap.min.css">
           <link rel="stylesheet" href="/css/theme.css">
           <link rel="stylesheet" href="/css/styles.css">
          </head>
          <body>
            <div id="react-view">${ReactView}</div>
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};
            </script>
            <script type="application/javascript" src="/vendor.js"></script>
            <script type="application/javascript" src="/bundle.js"></script>
          </body>
        </html>`
      )
    }
  })
})

export default app;
