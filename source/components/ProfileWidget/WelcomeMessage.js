import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

WelcomeMessage.propTypes = {
  userId: PropTypes.number,
  openSigninModal: PropTypes.func
};

export default function WelcomeMessage({ userId, openSigninModal }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {!userId && (
        <>
          <div className="login-message">Log in</div>
          <div className="login-message">to access all features</div>
        </>
      )}
      {!userId && (
        <Button
          filled
          color="green"
          style={{ marginTop: '1rem' }}
          onClick={openSigninModal}
        >
          Tap here!
        </Button>
      )}
    </div>
  );
}
