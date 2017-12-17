import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Modal, Alert } from 'react-bootstrap'
import Button from 'components/Button'
import { stringIsEmpty } from 'helpers/stringHelpers'
import Input from 'components/Texts/Input'

export default class LoginForm extends Component {
  static propTypes = {
    loginAsync: PropTypes.func.isRequired,
    showSignUpForm: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      errorMessage: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const { showSignUpForm } = this.props
    const { username, password, errorMessage } = this.state
    return (
      <div>
        {errorMessage && <Alert bsStyle="warning">{errorMessage}</Alert>}
        <div className="container-fluid">
          <fieldset className="form-group">
            <label>Username</label>
            <Input
              name="username"
              className="form-control"
              value={username}
              onChange={text => {
                this.setState({
                  errorMessage: '',
                  username: text
                })
              }}
              placeholder="Enter your username"
              type="text"
              onKeyPress={event => {
                if (
                  !stringIsEmpty(username) &&
                  !stringIsEmpty(password) &&
                  event.key === 'Enter'
                ) {
                  this.onSubmit()
                }
              }}
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Password</label>
            <Input
              name="password"
              className="form-control"
              value={password}
              onChange={text => {
                this.setState({
                  errorMessage: '',
                  password: text
                })
              }}
              placeholder="Enter your password"
              type="password"
              onKeyPress={event => {
                if (
                  !stringIsEmpty(username) &&
                  !stringIsEmpty(password) &&
                  event.key === 'Enter'
                ) {
                  this.onSubmit()
                }
              }}
            />
          </fieldset>
        </div>
        <br />
        <Modal.Footer>
          <Button
            className="btn btn-warning"
            style={{
              fontSize: '1em',
              marginRight: '1em'
            }}
            onClick={showSignUpForm}
          >
            {"Wait, I don't think I have an account, yet"}
          </Button>
          <Button
            className="btn btn-lg btn-primary"
            style={{ fontSize: '1.5em' }}
            disabled={stringIsEmpty(username) || stringIsEmpty(password)}
            onClick={this.onSubmit}
          >
            Log me in!
          </Button>
        </Modal.Footer>
      </div>
    )
  }

  onSubmit() {
    const { loginAsync } = this.props
    const { username, password } = this.state
    return loginAsync({ username, password }).catch(error =>
      this.setState({ errorMessage: error })
    )
  }
}
