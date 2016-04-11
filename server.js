import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import routes from 'routes';
import { Provider } from 'react-redux';
import * as reducers from 'reducers';
import promiseMiddleware from 'lib/promiseMiddleware';
import fetchComponentData from 'lib/fetchComponentData';
import { createStore,
         combineReducers,
         applyMiddleware,
         compose } from 'redux';
import path from 'path';
import session from 'client-sessions';
import { siteSession } from './siteConfig';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('./webpack.dev').default(app);
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/api', require('./api'));
app.use(siteSession());
app.use((req, res) => {
  global.SESSION = req.session;
  const location = createLocation(req.url);
  const reducer = combineReducers(reducers);
  const store = createStore(
    reducer,
    compose(
      applyMiddleware(promiseMiddleware)
    )
  )

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps)
      return res.status(404).end('Not found');

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
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.3.15/slick.css" />
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <div id="react-view">${componentHTML}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};
          </script>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>
      `;
      return HTML;
    }

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(renderView)
      .then(html => res.end(html))
      .catch(err => res.end(err.message));
  });
});

export default app;
