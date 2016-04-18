import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'app/index';
import Home from 'containers/Home';

import Profile from 'containers/Profile';
import Posts from 'containers/Posts';
import Discussion from 'containers/Discussion';
import Contents from 'containers/Contents';
import ContentsMain from 'containers/Contents/Main';
import VideoPage from 'containers/Contents/VideoPage';
import Management from 'containers/Management';
import AdminOnly from 'component_wrappers/AdminOnly';
import NotFound from 'components/NotFound';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import * as reducers from 'reducers';
import promiseMiddleware from 'lib/promiseMiddleware';
import { loadVideoPage } from 'actions/VideoActions';

let storeElements = [
  combineReducers(reducers)
]

if (typeof window !== 'undefined') storeElements.push(window.__INITIAL_STATE__);
export const store = createStore(
  ...storeElements,
  compose(
    applyMiddleware(promiseMiddleware)
  )
);

export const routes = (
  <Route name="app" component={App} path="/">
    <IndexRoute component={Home}/>

    <Route path="/profile" component={Profile}/>
    <Route path="/posts" component={Posts}/>
    <Route path="/discussion" component={Discussion}/>
    <Route path="/contents" component={Contents}>
      <IndexRoute component={ContentsMain}/>
      <Route
        path="/contents/videos/:videoId"
        component={VideoPage}
        onEnter={onVideoPageEnter}
      />
    </Route>
    <Route path="/management" component={AdminOnly(Management)}/>

    <Route path="*" component={NotFound} status={404} />
  </Route>
);

function onVideoPageEnter(nextState, replaceState, callback) {
  let unsubscribe;
  function onStateChanged() {
    const state = store.getState();
    if (state.VideoReducer.videoPage.title) {
      unsubscribe();
      callback();
    }
  }
  unsubscribe = store.subscribe(onStateChanged);
  store.dispatch(loadVideoPage(nextState.params));
}
