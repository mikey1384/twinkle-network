import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'app/index';
import Home from 'containers/Home';

import Profile from 'containers/Profile';
import Posts from 'containers/Posts';
import Discussion from 'containers/Discussion';
import Contents from 'containers/Contents';
import ContentsMain from 'containers/Contents/Main';
import Management from 'containers/Management';
import VideoPage from 'containers/VideoPage';

import AdminOnly from 'component_wrappers/AdminOnly';

import NotFound from 'components/NotFound';

export default (
  <Route name="app" component={App} path="/">
    <IndexRoute component={Home}/>

    <Route path="/profile" component={Profile}/>
    <Route path="/posts" component={Posts}/>
    <Route path="/discussion" component={Discussion}/>
    <Route path="/contents" component={Contents}>
      <IndexRoute component={ContentsMain}/>
      <Route path="/contents/videos/:videoId" component={VideoPage} />
    </Route>
    <Route path="/management" component={AdminOnly(Management)}/>

    <Route path="*" component={NotFound} status={404} />
  </Route>
);
