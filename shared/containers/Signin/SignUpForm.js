import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {Modal, Button, Alert} from 'react-bootstrap';


@reduxForm({
  form: 'SignupForm',
  validate
})
export default class SignUpForm extends Component {
  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.setState({
      checkedTeacher: false
    })
  }

  render () {
    const {checkedTeacher} = this.state;
    const {
      handleSubmit,
      errorMessage,
      hideErrorAlert
    } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)} onInput={() => hideErrorAlert()}>
        { errorMessage &&
          <Alert bsStyle="danger">
            {errorMessage}
          </Alert>
        }
        <div className="container-fluid">
          <fieldset>
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Your account username for logging in" />
            <span className="help-block">
              {/*userNameFieldError ? username.error : ''*/}
            </span>
          </fieldset>
          <fieldset>
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" />
            <span className="help-block">
              {/*passwordFieldError ? password.error : ''*/}
            </span>
          </fieldset>
          <fieldset>
            <label>First Name</label>
            <input type="text" className="form-control" placeholder="Your first name" />
            <span className="help-block">
              {/*firstNameFieldError ? firstname.error : ''*/}
            </span>
          </fieldset>
          <fieldset>
            <label>Last Name</label>
            <input type="text" className="form-control" placeholder="Your lastname" />
            <span className="help-block">
              {/*lastNameFieldError ? lastname.error : ''*/}
            </span>
          </fieldset>
          <fieldset className="form-group">
            <label>I'm a Teacher:&nbsp;&nbsp;&nbsp;</label>
            <input
              type="checkbox"
              checked={checkedTeacher}
              onClick={()=>this.setState({checkedTeacher:!checkedTeacher})}
            />
          </fieldset>
          <fieldset>
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Email is not required except for teachers" />
            <span className="help-block">
              {/*emailFieldError ? email.error : ''*/}
            </span>
          </fieldset>
        </div>
        <br />
        <Modal.Footer>
          <Button type="submit">Sign Up</Button>
        </Modal.Footer>
      </form>
    )
  }

  onSubmit(props) {
    this.props.signupAsync(props)
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
