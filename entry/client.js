import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {routes, store, history} from 'Root';
import {Router} from 'react-router';

render(
  <Provider store={store}>
    <Router children={routes} history={history} />
  </Provider>,
  document.getElementById('react-view')
);
