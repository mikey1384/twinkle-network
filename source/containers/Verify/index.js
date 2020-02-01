import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';
import Email from './Email';

Verify.propTypes = {
  match: PropTypes.object.isRequired
};

export default function Verify({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/email/:token`} component={Email} />
      <Route component={NotFound} />
    </Switch>
  );
}
