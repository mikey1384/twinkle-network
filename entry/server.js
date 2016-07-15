import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server'
import {RouterContext, match} from 'react-router';
import createLocation from 'history/lib/createLocation';
import {Provider} from 'react-redux';
import path from 'path';
import session from 'client-sessions';
import {routes, store} from 'Root';
import {initActions} from 'redux/actions';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('../webpack.dev').default(app);
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  const location = createLocation(req.url);

  match({routes, location}, (err, redirectLocation, renderProps) => {
    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps) return res.status(404).end('Not found');

    store.dispatch(initActions(req.session))
    .then(() => res.end(renderView()))
    .catch(err => res.end(err.message))

    function renderView() {
      const InitialView = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      const componentHTML = renderToString(InitialView);
      const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Twinkle</title>
          <link rel="stylesheet" href="/css/bootstrap.min.css">
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <div id="react-view">${componentHTML}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};
          </script>
          <script type="application/javascript" src="/vendor.js"></script>
          
        </body>
      </html>
      `;
      return HTML;
    }
  });
});

export default app;
