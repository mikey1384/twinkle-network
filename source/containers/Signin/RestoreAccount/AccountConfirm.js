import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Loading from 'components/Loading';
import { Color } from 'constants/css';

AccountConfirm.propTypes = {
  searching: PropTypes.bool.isRequired,
  notExist: PropTypes.bool.isRequired,
  matchingAccount: PropTypes.string,
  style: PropTypes.object
};

export default function AccountConfirm({
  notExist,
  searching,
  matchingAccount,
  style
}) {
  return (
    <ErrorBoundary style={{ fontSize: '2rem', ...style }}>
      {searching && <Loading />}
      {notExist && (
        <div style={{ padding: '1rem', fontWeight: 'bold' }}>
          That user account does not exist
        </div>
      )}
      {matchingAccount && (
        <div
          style={{
            padding: '1rem',
            fontWeight: 'bold',
            color: Color.darkerGray()
          }}
        >
          Hello {matchingAccount}! Press{' '}
          <span style={{ color: Color.blue() }}>{`Next`}</span> to continue
        </div>
      )}
    </ErrorBoundary>
  );
}
