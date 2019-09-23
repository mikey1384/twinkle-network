import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Main from './Main';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

Signin.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function Signin({ onHide }) {
  const [currentPage, setCurrentPage] = useState('main');
  return (
    <ErrorBoundary>
      <Modal show onHide={onHide}>
        <header>
          {currentPage === 'main' &&
            `Welcome to Twinkle. Do you have a Twinkle account?`}
          {currentPage === 'login' &&
            `Great! What's your username and password?`}
          {currentPage === 'signUp' && `Sure, let's set up your account...`}
        </header>
        <>
          {currentPage === 'main' && (
            <Main
              onShowLoginForm={() => setCurrentPage('login')}
              onShowSignUpForm={() => setCurrentPage('signUp')}
            />
          )}
          {currentPage === 'login' && (
            <LoginForm onShowSignupForm={() => setCurrentPage('signUp')} />
          )}
          {currentPage === 'signUp' && (
            <SignUpForm onShowLoginForm={() => setCurrentPage('login')} />
          )}
        </>
      </Modal>
    </ErrorBoundary>
  );
}
