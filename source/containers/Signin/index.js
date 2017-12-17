import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import Main from './Main'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from 'redux/actions/UserActions'

class SigninModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      currentPage: 'main'
    }
  }

  render() {
    const { currentPage } = this.state
    const { dispatch, onHide } = this.props
    return (
      <Modal show onHide={onHide} animation={false}>
        <Modal.Header closeButton>
          {currentPage === 'main' && (
            <h3>Welcome to Twinkle. Do you have a Twinkle account?</h3>
          )}
          {currentPage === 'login' && (
            <h3>{"Great! What's your account username and password?"}</h3>
          )}
          {currentPage === 'signUp' && (
            <h3>{"Sure, let's set up your account..."}</h3>
          )}
        </Modal.Header>
        <Modal.Body>
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
          {currentPage === 'signUp' && (
            <SignUpForm
              showLoginForm={() => this.setState({ currentPage: 'login' })}
              {...bindActionCreators(UserActions, dispatch)}
            />
          )}
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect()(SigninModal)
