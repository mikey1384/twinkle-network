import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

Main.propTypes = {
  onShowForgotPasswordForm: PropTypes.func.isRequired,
  onShowLoginForm: PropTypes.func.isRequired,
  onShowSignUpForm: PropTypes.func.isRequired
};

export default function Main({
  onShowForgotPasswordForm,
  onShowLoginForm,
  onShowSignUpForm
}) {
  return (
    <main>
      <Button
        color="limeGreen"
        style={{ display: 'block', fontSize: '2.7rem', padding: '1rem' }}
        onClick={onShowLoginForm}
      >
        Yes, I have an account
      </Button>
      <Button
        color="orange"
        style={{ marginTop: '1rem', fontSize: '2.5rem', padding: '1rem' }}
        onClick={onShowSignUpForm}
      >
        {"No, I don't have an account"}
      </Button>
      <Button
        color="pink"
        style={{
          marginTop: '1.5rem',
          fontSize: '2rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}
        onClick={onShowForgotPasswordForm}
      >
        {'I have an account but I forgot my password'}
      </Button>
    </main>
  );
}
