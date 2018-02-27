import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Button from 'components/Button'
import { stringIsEmpty } from 'helpers/stringHelpers'
import Input from 'components/Texts/Input'
import Banner from 'components/Banner'

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
      <Fragment>
        {errorMessage && <Banner love>{errorMessage}</Banner>}
        <div className="modal-body">
          <div style={{ width: '100%' }}>
            <div>
              <Input
                name="username"
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
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Input
                name="password"
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
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button
            primary
            style={{ fontSize: '2.5rem' }}
            disabled={stringIsEmpty(username) || stringIsEmpty(password)}
            onClick={this.onSubmit}
          >
            Log me in!
          </Button>
          <Button
            style={{
              fontSize: '1.5rem',
              marginRight: '1.5rem'
            }}
            onClick={showSignUpForm}
          >
            {"Wait, I don't think I have an account, yet"}
          </Button>
        </div>
      </Fragment>
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
