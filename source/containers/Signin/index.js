import React, {Component, PropTypes} from 'react'
import {Modal} from 'react-bootstrap'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
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
      loginTabActive: false
    }
  }

  render() {
    const {loginTabActive} = this.state
    const {signupError, loginError, dispatch} = this.props
    return (
      <Modal
        show
        onHide={this.props.onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <ul className="nav nav-pills nav-justified">
            <li
              className={loginTabActive ? '' : 'active'}
              onClick={() => this.setState({loginTabActive: false})}
              style={{cursor: 'pointer'}}
            >
              <a>Sign Up</a>
            </li>
            <li
              className={loginTabActive ? 'active' : ''}
              onClick={() => this.setState({loginTabActive: true})}
              style={{cursor: 'pointer'}}
            >
              <a>Log In (If you already have an account)</a>
            </li>
          </ul>
        </Modal.Header>
        <Modal.Body>
          <div className="tab-content container-fluid">
            <div className={`tab-pane ${loginTabActive ? '' : 'active'}`}>
              <SignUpForm
                errorMessage={signupError}
                {...bindActionCreators(UserActions, dispatch)}
              />
            </div>
            <div className={`tab-pane ${loginTabActive ? 'active' : ''}`}>
              <LoginForm
                errorMessage={loginError}
                {...bindActionCreators(UserActions, dispatch)}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
