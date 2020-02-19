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
      </Modal>
    </ErrorBoundary>
  );
}
