import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import LinkPage from './LinkPage';
import Main from './Main';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

Links.propTypes = {
  match: PropTypes.object.isRequired
};
export default function Links({ match }) {
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        margin-top: 1rem;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 0;
        }
      `}
    >
      <Route exact path={`${match.url}`} component={Main} />
      <Route path={`${match.url}/:linkId`} component={LinkPage} />
    </div>
  );
}
