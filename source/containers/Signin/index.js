import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import RestoreAccount from './RestoreAccount';
import Main from './Main';
import ErrorBoundary from 'components/ErrorBoundary';

Signin.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function Signin({ onHide }) {
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('main');
  return (
    <ErrorBoundary>
      <Modal
        onHide={onHide}
        modalStyle={{
          marginTop: currentPage === 'main' && 'CALC(50vh - 25rem)'
        }}
      >
        <header>
          {currentPage === 'main' &&
            `Welcome to Twinkle. Do you have a Twinkle account?`}
          {currentPage === 'login' && `What's your username and password?`}
          {currentPage === 'signUp' &&
            `Welcome to Twinkle! Let's set up your account`}
          {currentPage === 'restore' && `No problem! We are here to help`}
        </header>
        <>
          {currentPage === 'main' && (
            <Main
              onShowLoginForm={() => setCurrentPage('login')}
              onShowSignUpForm={() => setCurrentPage('signUp')}
              onShowForgotPasswordForm={() => setCurrentPage('restore')}
            />
          )}
          {currentPage === 'login' && (
            <LoginForm
              username={username}
              onSetUsername={setUsername}
              onShowSignupForm={() => setCurrentPage('signUp')}
              onShowForgotPasswordForm={() => setCurrentPage('restore')}
            />
          )}
          {currentPage === 'signUp' && (
            <SignUpForm
              username={username}
              onSetUsername={setUsername}
              onShowLoginForm={() => setCurrentPage('login')}
            />
          )}
          {currentPage === 'restore' && (
            <RestoreAccount
              username={username}
              onSetUsername={setUsername}
              onShowLoginForm={() => setCurrentPage('login')}
            />
          )}
        </>
      </Modal>
    </ErrorBoundary>
  );
}
