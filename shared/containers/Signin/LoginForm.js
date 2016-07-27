import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {Modal, Button, Alert} from 'react-bootstrap';
import {stringIsEmpty} from 'helpers/stringHelpers';

// className={`form-group ${userNameFieldError ? 'has-error' : ''}`}

const renderInput = field => (
  <div>
    <input {...field.input}/>
    <span className="help-block">{field.touched && field.error && field.error}</span>
  </div>
)

@reduxForm({
  form: 'LoginForm',
  validate
})
export default class LoginForm extends Component {
  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  render () {
    const {handleSubmit, errorMessage, hideErrorAlert} = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)} onInput={() => hideErrorAlert()} >
        {errorMessage &&
          <Alert bsStyle="danger">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <fieldset>
            <label>Username</label>
            <Field
              name="username"
              placeholder="Username"
              type="text"
              className="form-control"
              component={renderInput}
              type="text"
            />
          </fieldset>
          <fieldset>
            <label>Password</label>
            <Field
              name="password"
              placeholder="Password"
              type="text"
              className="form-control"
              component={renderInput}
              type="password"
            />
          </fieldset>
        </div>
        <br />
        <Modal.Footer>
          <Button type="submit">Log In</Button>
        </Modal.Footer>
      </form>
    )
  }

  onSubmit(props) {
    this.props.loginAsync(props)
  }
}

function validate(values) {
  const {username, password} = values;
  const errors = {};
  if (stringIsEmpty(username)) {
    errors.username = 'Enter username';
  }
  if (stringIsEmpty(password)) {
    errors.password = 'Enter password';
  }
  return errors;
}
