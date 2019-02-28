import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'components/Modal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import Main from './Main';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from 'redux/actions/UserActions';

class Signin extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      available: false,
      currentPage: 'main'
    };
  }

  render() {
    const { available, currentPage } = this.state;
    const { dispatch, onHide } = this.props;
    return (
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
              showLoginForm={() => this.setState({ currentPage: 'login' })}
              showSignUpForm={() => this.setState({ currentPage: 'signUp' })}
            />
          )}
          {currentPage === 'login' && (
            <LoginForm
              showSignUpForm={() => this.setState({ currentPage: 'signUp' })}
              {...bindActionCreators(UserActions, dispatch)}
            />
          )}
          {currentPage === 'signUp' && available && (
            <SignUpForm
              showLoginForm={() => this.setState({ currentPage: 'login' })}
              {...bindActionCreators(UserActions, dispatch)}
            />
          )}
          {currentPage === 'signUp' && !available && (
            <div
              style={{
                fontSize: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              Sorry, signing up through the website is currently unavailable.
              Ask your teacher for assistence
            </div>
          )}
        </>
      </Modal>
    );
  }
}

export default connect()(Signin);
