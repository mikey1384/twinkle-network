import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'containers/App';

import Home from 'containers/Home';
import Feeds from 'containers/Home/Feeds';
import Profile from 'containers/Home/Profile';
import Links from 'containers/Links';
import Videos from 'containers/Videos';
import VideosMain from 'containers/Videos/Main';
import VideoPage from 'containers/Videos/VideoPage';

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import * as reducers from 'redux/reducers';
import {routerReducer, routerMiddleware} from 'react-router-redux'
import ReduxThunk from 'redux-thunk';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';


let storeElements = [
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
]
let middlewares = [
  ReduxThunk
]

if (typeof window !== 'undefined') {
  storeElements.push(window.__INITIAL_STATE__);
  if (browserHistory) middlewares.push(routerMiddleware(browserHistory));
}

export const store = createStore(
  ...storeElements,
  compose(
    applyMiddleware(...middlewares)
  )
);

export const history = browserHistory ? syncHistoryWithStore(browserHistory, store) : null;

export const routes = (
  <Route
    name="app"
    component={App}
  >
    <Route path="/videos" component={Videos}>
      <IndexRoute component={VideosMain} />
      <Route path=":videoId" component={VideoPage} />
    </Route>
    <Route path="/links" component={Links} />
    <Route path="/" component={Home}>
      <IndexRoute component={Feeds} />
      <Route path=":username" component={Profile} />
    </Route>
  </Route>
)
