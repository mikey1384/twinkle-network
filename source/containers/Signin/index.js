import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import Main from './Main'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as UserActions from 'redux/actions/UserActions'

@connect(
  state => ({
    loginError: state.UserReducer.loginError,
    signupError: state.UserReducer.signupError
  })
)
export default class SigninModal extends Component {
  static propTypes = {
    signupError: PropTypes.string,
    loginError: PropTypes.string,
    dispatch: PropTypes.func,
    onHide: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      currentPage: 'main'
    }
  }

  render() {
    const {currentPage} = this.state
    const {signupError, loginError, dispatch} = this.props
    return (
      <Modal
        show
        onHide={this.props.onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          {currentPage === 'main' &&
            <h3>Welcome to Twinkle. Do you have a Twinkle account?</h3>
          }
          {currentPage === 'login' &&
            <h3>Great! What's your account username and password?</h3>
          }
          {currentPage === 'signUp' &&
            <h3>Sure, let's set up your account...</h3>
          }
        </Modal.Header>
        <Modal.Body>
          {currentPage === 'main' &&
            <Main
              showLoginForm={() => this.setState({currentPage: 'login'})}
              showSignUpForm={() => this.setState({currentPage: 'signUp'})}
            />
          }
          {currentPage === 'login' &&
            <LoginForm
              errorMessage={loginError}
              showSignUpForm={() => this.setState({currentPage: 'signUp'})}
              {...bindActionCreators(UserActions, dispatch)}
            />
          }
          {currentPage === 'signUp' &&
            <SignUpForm
              errorMessage={signupError}
              showLoginForm={() => this.setState({currentPage: 'login'})}
              {...bindActionCreators(UserActions, dispatch)}
            />
          }
        </Modal.Body>
      </Modal>
    )
  }
}
