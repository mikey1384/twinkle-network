import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {routes, store, history} from 'Root';
import {Router, applyRouterMiddleware} from 'react-router';
import {useScroll} from 'react-router-scroll';

render(
  <Provider store={store}>
    <Router
      children={routes}
      history={history}
      render={applyRouterMiddleware(useScroll(prevRouterProps => prevRouterProps ? true : [0, 0]))}
    />
  </Provider>,
  document.getElementById('react-view')
);
