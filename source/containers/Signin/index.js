import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Main from './Main';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'redux/actions/UserActions';

Signin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

function Signin({ dispatch, onHide }) {
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
              onShowSignupForm={() => setCurrentPage('signUp')}
            />
          )}
          {currentPage === 'login' && (
            <LoginForm
              onShowSignupForm={() => setCurrentPage('signUp')}
              {...bindActionCreators(UserActions, dispatch)}
            />
          )}
          {currentPage === 'signUp' && (
            <SignUpForm
              onShowLoginForm={() => setCurrentPage('login')}
              {...bindActionCreators(UserActions, dispatch)}
            />
          )}
        </>
      </Modal>
    </ErrorBoundary>
  );
}

export default connect()(Signin);
