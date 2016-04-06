import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, Alert } from 'react-bootstrap';


class SignUpForm extends Component {
  componentWillMount() {
    this.setState({
      checkedTeacher: false
    })
  }

  onSubmit(props) {
    this.props.signup(props)
  }

  render () {
    const { checkedTeacher } = this.state;
    const {
      fields: {username, firstname, lastname, password, isTeacher, email},
      handleSubmit,
      errorMessage,
      hideErrorAlert
    } = this.props;
    let userNameFieldError = username.touched && username.invalid ? true : false;
    let firstNameFieldError = firstname.touched && firstname.invalid ? true : false;
    let lastNameFieldError = lastname.touched && lastname.invalid ? true : false;
    let passwordFieldError = password.touched && password.invalid ? true : false;
    let emailFieldError = email.touched && email.invalid ? true : false;
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))} onInput={() => hideErrorAlert()}>
        { errorMessage &&
          <Alert bsStyle="danger">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <div className={`form-group ${userNameFieldError ? 'has-error' : ''}`}>
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Your account username for logging in" {...username} />
            <span className="help-block">
              {userNameFieldError ? username.error : ''}
            </span>
          </div>
          <div className={`form-group ${firstNameFieldError ? 'has-error' : ''}`}>
            <label>First Name</label>
            <input type="text" className="form-control" placeholder="Your first name" {...firstname} />
            <span className="help-block">
              {firstNameFieldError ? firstname.error : ''}
            </span>
          </div>
          <div className={`form-group ${lastNameFieldError ? 'has-error' : ''}`}>
            <label>Last Name</label>
            <input type="text" className="form-control" placeholder="Your lastname" {...lastname} />
            <span className="help-block">
              {lastNameFieldError ? lastname.error : ''}
            </span>
          </div>
          <div className={`form-group ${passwordFieldError ? 'has-error' : ''}`}>
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" {...password} />
            <span className="help-block">
              {passwordFieldError ? password.error : ''}
            </span>
          </div>
          <div className="form-group">
            <label>I'm a Teacher:&nbsp;&nbsp;&nbsp;</label>
            <input
              type="checkbox"
              checked={checkedTeacher}
              onClick={()=>this.setState({checkedTeacher:!checkedTeacher})}
              {...isTeacher} />
          </div>
          <div className={`form-group ${emailFieldError ? 'has-error' : ''}`}>
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Email is not required except for teachers" {...email} />
            <span className="help-block">
              {emailFieldError ? email.error : ''}
            </span>
          </div>
        </div>
        <br />
        <Modal.Footer>
          <Button type="submit">Sign Up</Button>
        </Modal.Footer>
      </form>
    )
  }
}

function validate (values) {
  const { username, firstname, lastname, password, email, isTeacher } = values;
  const errors = {};

  if (!isValidUsername(username)) {
    errors.username = 'Usernames may only contain letters and numbers';
  }
  if (!isValidRealname(firstname)) {
    errors.firstname = 'Invalid first name';
  }
  if (!isValidRealname(lastname)) {
    errors.lastname = 'Invalid last name';
  }
  if (email && !isValidEmailAddress(email)) {
    errors.email = 'Invalid email format';
  }
  if (username && username.length < 4) {
    errors.username = 'Usernames must be at least 4 characters long';
  }
  if (password && password.length < 6) {
    errors.password = 'Passwords must be at least 6 characters long';
  }
  if (!username) {
    errors.username = 'Enter a username';
  }
  if (!firstname) {
    errors.firstname = 'Enter your first name';
  }
  if (!lastname) {
    errors.lastname = 'Enter your last name';
  }
  if (!password) {
    errors.password = 'Enter a password';
  }
  if (isTeacher && !email) {
    errors.email = 'Teachers must provide an email address';
  }

  return errors;
}

function isValidEmailAddress (email) {
  var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
  return pattern.test(email);
};

function isValidRealname (realname) {
  var pattern = new RegExp(/^[a-zA-Z]+$/);
  return pattern.test(realname);
}

function isValidUsername (username) {
  var pattern = new RegExp(/^[a-zA-Z0-9]+$/);
  return pattern.test(username);
}

export default reduxForm({
  form: 'SignupForm',
  fields: ['username', 'firstname', 'lastname', 'password', 'isTeacher', 'email'],
  validate
})(SignUpForm);
