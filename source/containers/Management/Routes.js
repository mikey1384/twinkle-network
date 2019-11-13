import React from 'react';
import PropTypes from 'prop-types';
import Main from './Main';
import Notification from 'components/Notification';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { Route, Switch } from 'react-router-dom';

Routes.propTypes = {
  location: PropTypes.object
};

export default function Routes({ location }) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <div
        style={{
          marginTop: '1rem',
          width: 'CALC(100vw - 34rem)',
          marginLeft: '1rem'
        }}
      >
        <Switch>
          <Route path="/" component={Main} />
        </Switch>
      </div>
      <Notification
        className={css`
          width: 31rem;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          right: 1rem;
          top: 4.5rem;
          bottom: 0;
          position: absolute;
          @media (max-width: ${mobileMaxWidth}) {
            display: none;
          }
        `}
        location={location.pathname.substring(1)}
      />
    </div>
  );
}
