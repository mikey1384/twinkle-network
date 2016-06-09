import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, Alert } from 'react-bootstrap';
import { stringIsEmpty } from 'helpers/StringHelper';

class LoginForm extends Component {
  onSubmit(props) {
    this.props.loginAsync(props)
  }

  render () {
    const {fields: {username, password}, handleSubmit, errorMessage, hideErrorAlert} = this.props;
    let userNameFieldError = username.touched && username.invalid ? true : false;
    let passwordFieldError = password.touched && password.invalid ? true : false;
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))} onInput={() => hideErrorAlert()} >
        { errorMessage &&
          <Alert bsStyle="danger">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <fieldset className={`form-group ${userNameFieldError ? 'has-error' : ''}`}>
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Username" {...username} />
            <span className="help-block">
              {userNameFieldError ? username.error : ''}
            </span>
          </fieldset>
          <fieldset className={`form-group ${passwordFieldError ? 'has-error' : ''}`}>
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" {...password} />
            <span className="help-block">
              {passwordFieldError ? password.error : ''}
            </span>
          </fieldset>
        </div>
        <br />
        <Modal.Footer>
          <Button type="submit">Log In</Button>
        </Modal.Footer>
      </form>
    )
  }
}

function validate (values) {
  const { username, password } = values;
  const errors = {};
  if (stringIsEmpty(username)) {
    errors.username = 'Enter username';
  }
  if (password === '') {
    errors.password = 'Enter password';
  }
  return errors;
}

LoginForm = reduxForm({
  form: 'LoginForm',
  fields: ['username', 'password'],
  validate
})(LoginForm);

export default LoginForm;
