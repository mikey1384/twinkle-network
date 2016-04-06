import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Modal, Button, Alert } from 'react-bootstrap';

class LoginForm extends Component {
  onSubmit(props) {
    this.props.login(props)
  }

  render () {
    const {fields: {username, password}, handleSubmit, errorMessage, hideErrorAlert} = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))} onInput={() => hideErrorAlert()} >
        { errorMessage &&
          <Alert bsStyle="danger">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Username" {...username} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" {...password} />
          </div>
        </div>
        <br />
        <Modal.Footer>
          <Button type="submit">Log In</Button>
        </Modal.Footer>
      </form>
    )
  }
}

LoginForm = reduxForm({
  form: 'LoginForm',
  fields: ['username', 'password']
})(LoginForm);

export default LoginForm;
