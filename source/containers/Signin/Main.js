import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

Main.propTypes = {
  showLoginForm: PropTypes.func.isRequired,
  showSignUpForm: PropTypes.func.isRequired
};

export default function Main({ showLoginForm, showSignUpForm }) {
  return (
    <main>
      <Button
        success
        style={{ display: 'block', fontSize: '2.5rem', padding: '1rem' }}
        onClick={showLoginForm}
      >
        Yes, I have an account
      </Button>
      <Button
        warning
        style={{ marginTop: '1.5rem', fontSize: '2rem', padding: '1rem' }}
        onClick={showSignUpForm}
      >
        {"No, I'm a new user. Make me a new account, please!"}
      </Button>
    </main>
  );
}
