import React from 'react';
import PropTypes from 'prop-types';
import Content from './Content';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'components/NotFound';

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired
};

export default function ResetPassword({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/password/:token`} component={Content} />
      <Route component={NotFound} />
    </Switch>
  );
}
