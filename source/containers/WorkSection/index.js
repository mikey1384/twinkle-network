import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Loading from 'components/Loading';
import loadable from 'loadable-components';
const Videos = loadable(() => import('./Videos'), {
  LoadingComponent: Loading
});
const Links = loadable(() => import('./Links'), {
  LoadingComponent: Loading
});
const Work = loadable(() => import('./Work'), {
  LoadingComponent: Loading
});

export default class WorkSection extends Component {
  render() {
    return (
      <Switch>
        <Route path="/videos" component={Videos} />
        <Route path="/links" component={Links} />
        <Route path="/work" component={Work} />
      </Switch>
    );
  }
}
