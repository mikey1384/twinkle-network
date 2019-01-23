import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Videos from './Videos';
import Work from './Work';

export default class WorkSection extends Component {
  render() {
    return (
      <Switch>
        <Route path="/videos" component={Videos} />
        <Route path="/work" component={Work} />
      </Switch>
    );
  }
}
