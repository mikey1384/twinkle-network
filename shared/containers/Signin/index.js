import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as UserActions from 'redux_helpers/actions/UserActions';

class SigninModal extends Component {
  state = {
    loginTabActive: true
  }
  render() {
    const { loginTabActive } = this.state;
    const { signupError, loginError, dispatch } = this.props;
    return (
      <Modal {...this.props} animation={false}>
        <Modal.Header closeButton>
          <ul className="nav nav-pills nav-justified">
            <li
              className={loginTabActive ? "active" : ""}
              onClick={()=>this.setState({loginTabActive: true})}
              style={{cursor:"pointer"}}
            >
              <a>Log In</a>
            </li>
            <li
              className={loginTabActive ? "" : "active"}
              onClick={()=>this.setState({loginTabActive: false})}
              style={{cursor:"pointer"}}
            >
              <a>Sign Up</a>
            </li>
          </ul>
        </Modal.Header>
        <Modal.Body>
          <div className="tab-content container-fluid">
            <div className={`tab-pane ${loginTabActive ? "active" : ""}`}>
              <LoginForm
                errorMessage={ loginError }
                {...bindActionCreators(UserActions, dispatch)}
              />
            </div>
            <div className={`tab-pane ${loginTabActive ? "" : "active"}`}>
              <SignUpForm
                errorMessage={ signupError }
                {...bindActionCreators(UserActions, dispatch)}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(
  state => ({
    loginError: state.UserReducer.loginError,
    signupError: state.UserReducer.signupError
  })
)(SigninModal)
