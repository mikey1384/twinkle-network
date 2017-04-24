import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Modal, Alert} from 'react-bootstrap'
import Button from 'components/Button'
import {stringIsEmpty} from 'helpers/stringHelpers'

export default class SignUpForm extends Component {
  static propTypes = {
    signupAsync: PropTypes.func,
    showLoginForm: PropTypes.func
  }

  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.setState({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      errorMessage: ''
    })
  }

  render() {
    const {showLoginForm} = this.props
    const {username, password, firstname, lastname, email, errorMessage} = this.state
    const submitDisabled = stringIsEmpty(username) || stringIsEmpty(password) || stringIsEmpty(firstname) || stringIsEmpty(lastname) || errorMessage
    return (
      <div>
        {errorMessage &&
          <Alert bsStyle="warning">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <fieldset className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              value={username}
              placeholder="Enter the username you wish to use on this website"
              onChange={event => {
                this.setState({
                  errorMessage: '',
                  username: event.target.value
                })
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  this.onSubmit()
                }
              }}
              type="text"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              value={password}
              placeholder="Password (You MUST remember your password. Write it down somewhere!)"
              onChange={event => {
                this.setState({
                  errorMessage: '',
                  password: event.target.value
                })
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  this.onSubmit()
                }
              }}
              type="password"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>First Name</label>
            <input
              className="form-control"
              value={firstname}
              placeholder="What is your first name? Mine is Mikey"
              onChange={event => {
                this.setState({
                  errorMessage: '',
                  firstname: event.target.value
                })
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  this.onSubmit()
                }
              }}
              type="text"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Last Name</label>
            <input
              className="form-control"
              value={lastname}
              placeholder="What is your last name? Mine is Lee"
              onChange={event => {
                this.setState({
                  errorMessage: '',
                  lastname: event.target.value
                })
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  this.onSubmit()
                }
              }}
              type="text"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Email (optional, you don't need to enter this)</label>
            <input
              className="form-control"
              value={email}
              placeholder="Email is not required, but if you have one, enter it here"
              onChange={event => {
                this.setState({
                  errorMessage: '',
                  email: event.target.value
                })
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  this.onSubmit()
                }
              }}
              type="email"
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
            onClick={showLoginForm}
          >
            Wait, I already have an account!
          </Button>
          <Button
            className="btn btn-lg btn-primary"
            disabled={submitDisabled}
            onClick={this.onSubmit}
            style={{fontSize: '1.5em'}}
          >Create my account!</Button>
        </Modal.Footer>
      </div>
    )
  }

  onSubmit() {
    const {signupAsync} = this.props
    const {username, password, firstname, lastname, email} = this.state
    if (!isValidUsername(username)) return this.setState({errorMessage: 'That is not a valid username'})
    if (!isValidPassword(password)) return this.setState({errorMessage: 'Passwords need to be at least 5 characters long'})
    if (!isValidRealname(firstname)) return this.setState({errorMessage: 'That\'s not a valid name'})
    if (!isValidRealname(lastname)) return this.setState({errorMessage: 'That\'s not a valid last name'})
    if (email && !isValidEmailAddress(email)) return this.setState({errorMessage: 'That email address is invalid'})
    return signupAsync({username, password, firstname, lastname, email}).catch(
      error => this.setState({errorMessage: error})
    )
  }
}

function isValidEmailAddress(email) {
  let regex = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
  let pattern = new RegExp(regex)
  return pattern.test(email)
}

function isValidRealname(realName) {
  var pattern = new RegExp(/^[a-zA-Z]+$/)
  return pattern.test(realName)
}

function isValidUsername(username) {
  var pattern = new RegExp(/^[a-zA-Z0-9]+$/)
  return !!username && username.length < 20 && pattern.test(username)
}

function isValidPassword(password) {
  return password.length > 4 && !stringIsEmpty(password)
}
