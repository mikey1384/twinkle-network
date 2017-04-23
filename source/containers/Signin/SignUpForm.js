import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {reduxForm, Field} from 'redux-form'
import {Modal, Alert} from 'react-bootstrap'
import Button from 'components/Button'

/* eslint-disable react/prop-types */
const renderInput = ({input, type, className, placeholder, meta: {touched, error}}) => (
  <div style={{display: 'inline'}}>
    <input
      {...input}
      className={className}
      placeholder={placeholder}
      type={type}
    />
    <span
      className="help-block"
      style={{color: 'red'}}
    >{touched && error && error}</span>
  </div>
)
/* eslint-enable react/prop-types */

@reduxForm({
  form: 'SignupForm',
  validate
})
export default class SignUpForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    errorMessage: PropTypes.string,
    hideErrorAlert: PropTypes.func,
    signupAsync: PropTypes.func,
    showLoginForm: PropTypes.func
  }

  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.setState({
      checkedTeacher: false
    })
  }

  render() {
    const {checkedTeacher} = this.state
    const {showLoginForm} = this.props
    const {
      handleSubmit,
      errorMessage,
      hideErrorAlert
    } = this.props
    return (
      <form
        onSubmit={handleSubmit(this.onSubmit)} onInput={() => hideErrorAlert()}
      >
        { errorMessage &&
          <Alert bsStyle="danger">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <fieldset className="form-group">
            <label>Username</label>
            <Field
              name="username"
              placeholder="Username"
              className="form-control"
              component={renderInput}
              type="text"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Password</label>
            <Field
              name="password"
              placeholder="Password (You MUST remember your password. Write it down somewhere!)"
              className="form-control"
              component={renderInput}
              type="password"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>First Name</label>
            <Field
              name="firstname"
              placeholder="Your first name"
              className="form-control"
              component={renderInput}
              type="text"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Last Name</label>
            <Field
              name="lastname"
              placeholder="Your last name"
              className="form-control"
              component={renderInput}
              type="text"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>I'm a Teacher:&nbsp;&nbsp;&nbsp;</label>
            <Field
              name="isTeacher"
              checked={checkedTeacher}
              onClick={() => this.setState({checkedTeacher: !checkedTeacher})}
              component={renderInput}
              type="checkbox"
            />
          </fieldset>
          <fieldset className="form-group">
            <label>Email</label>
            <Field
              name="email"
              placeholder="Email is not required except for teachers"
              className="form-control"
              component={renderInput}
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
          <Button className="btn btn-lg btn-primary" type="submit" style={{fontSize: '1.5em'}}>Create my account!</Button>
        </Modal.Footer>
      </form>
    )
  }

  onSubmit(props) {
    this.props.signupAsync(props)
  }
}

function validate(values) {
  const {username, firstname, lastname, password, email, isTeacher} = values
  const errors = {}

  if (!isValidUsername(username)) {
    errors.username = 'Invalid username'
  }
  if (!isValidRealname(firstname)) {
    errors.firstname = 'Invalid first name'
  }
  if (!isValidRealname(lastname)) {
    errors.lastname = 'Invalid last name'
  }
  if (email && !isValidEmailAddress(email)) {
    errors.email = 'Invalid email format'
  }
  if (username && username.length < 4) {
    errors.username = 'Usernames must be at least 4 characters long'
  }
  if (password && password.length < 6) {
    errors.password = 'Passwords must be at least 6 characters long'
  }
  if (!username) {
    errors.username = 'Enter a username'
  }
  if (!firstname) {
    errors.firstname = 'Enter your first name'
  }
  if (!lastname) {
    errors.lastname = 'Enter your last name'
  }
  if (!password) {
    errors.password = 'Enter a password'
  }
  if (isTeacher && !email) {
    errors.email = 'Teachers must provide an email address'
  }

  return errors
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
