import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import Email from './Email';

export default class Verify extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/email/:token`} component={Email} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
