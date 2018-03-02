import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Modal from 'components/Modal'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import Main from './Main'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from 'redux/actions/UserActions'

class Signin extends Component {
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
      <Modal show onHide={onHide}>
        <header>
          {currentPage === 'main' && (
            <span>{`Welcome to Twinkle. Do you have a Twinkle account?`}</span>
          )}
          {currentPage === 'login' && (
            <span>{`Great! What's your username and password?`}</span>
          )}
          {currentPage === 'signUp' && (
            <span>{`Sure, let's set up your account...`}</span>
          )}
        </header>
        <Fragment>
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
        </Fragment>
      </Modal>
    )
  }
}

export default connect()(Signin)
