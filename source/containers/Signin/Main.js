import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

Main.propTypes = {
  onShowLoginForm: PropTypes.func.isRequired,
  onShowSignUpForm: PropTypes.func.isRequired
};

export default function Main({ onShowLoginForm, onShowSignUpForm }) {
  return (
    <main>
      <Button
        color="logoBlue"
        style={{ display: 'block', fontSize: '2.5rem', padding: '1rem' }}
        onClick={onShowLoginForm}
      >
        Yes, I have an account
      </Button>
      <Button
        color="pink"
        style={{ marginTop: '1.5rem', fontSize: '2rem', padding: '1rem' }}
        onClick={onShowSignUpForm}
      >
        {"No, I'm a new user. Make me a new account, please!"}
      </Button>
    </main>
  );
}
