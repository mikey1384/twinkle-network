import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import NotFound from 'components/NotFound';
import Content from './Content';

VideoPage.propTypes = {
  match: PropTypes.object.isRequired
};
export default function VideoPage({ match }) {
  return (
    <Switch>
      <Route path={`${match.url}/:videoId`} component={Content} />
      <Route component={NotFound} />
    </Switch>
  );
}
