import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {Modal, Button, Alert} from 'react-bootstrap';
import {stringIsEmpty} from 'helpers/stringHelpers';


const renderInput = field => (
  <div>
    <input {...field.input} />
    <span
      className="help-block"
      style={{color: 'red'}}
    >{field.touched && field.error && field.error}</span>
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
              placeholder="Password"
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
