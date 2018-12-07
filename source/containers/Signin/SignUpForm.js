import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'components/Button';
import { stringIsEmpty, trimWhiteSpaces } from 'helpers/stringHelpers';
import Input from 'components/Texts/Input';
import { css } from 'emotion';
import { Color } from 'constants/css';
import Banner from 'components/Banner';

export default class SignUpForm extends Component {
  static propTypes = {
    signup: PropTypes.func.isRequired,
    showLoginForm: PropTypes.func.isRequired
  };

  state = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    errorMessage: ''
  };

  render() {
    const { showLoginForm } = this.props;
    const {
      username,
      password,
      firstname,
      lastname,
      email,
      errorMessage
    } = this.state;
    const submitDisabled =
      stringIsEmpty(username) ||
      stringIsEmpty(password) ||
      stringIsEmpty(firstname) ||
      stringIsEmpty(lastname) ||
      errorMessage;
    return (
      <>
        {errorMessage && <Banner love>{errorMessage}</Banner>}
        <main>
          <div
            className={css`
              width: 100%;
              padding: 1rem 1.5rem 1.5rem 1.5rem;
              section {
                margin-top: 1rem;
              }
              section:first-of-type {
                margin-top: 0;
              }
              input {
                margin-top: 0.5rem;
              }
              label {
                font-weight: bold;
              }
            `}
          >
            <section>
              <label>Username</label>
              <Input
                value={username}
                placeholder="Enter the username you wish to use. It has to be at least 4 characters long"
                onChange={text => {
                  this.setState({
                    errorMessage: '',
                    username: trimWhiteSpaces(text)
                  });
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter' && !submitDisabled) {
                    this.onSubmit();
                  }
                }}
                type="text"
              />
            </section>
            <section>
              <label>Password</label>
              <Input
                value={password}
                placeholder="Password (You MUST remember your password. Write it down somewhere!)"
                onChange={text => {
                  this.setState({
                    errorMessage: '',
                    password: text
                  });
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter' && !submitDisabled) {
                    this.onSubmit();
                  }
                }}
                type="password"
              />
            </section>
            <section>
              <label>First Name</label>
              <Input
                value={firstname}
                placeholder="What is your first name? Mine is Mikey"
                onChange={text => {
                  this.setState({
                    errorMessage: '',
                    firstname: trimWhiteSpaces(text)
                  });
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter' && !submitDisabled) {
                    this.onSubmit();
                  }
                }}
                type="text"
              />
            </section>
            <section>
              <label>Last Name</label>
              <Input
                value={lastname}
                placeholder="What is your last name? Mine is Lee"
                onChange={text => {
                  this.setState({
                    errorMessage: '',
                    lastname: trimWhiteSpaces(text)
                  });
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter' && !submitDisabled) {
                    this.onSubmit();
                  }
                }}
                type="text"
              />
            </section>
            <section style={{ marginTop: '2rem' }}>
              <label style={{ fontWeight: 'normal' }}>
                {'Email '}
                <span
                  style={{ color: Color.gray() }}
                >{`(optional, you don't need to enter this)`}</span>
              </label>
              <Input
                value={email}
                placeholder="Email is not required, but if you have one, enter it here"
                onChange={text => {
                  this.setState({
                    errorMessage: '',
                    email: text
                  });
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter' && !submitDisabled) {
                    this.onSubmit();
                  }
                }}
                type="email"
              />
            </section>
          </div>
        </main>
        <footer>
          <Button
            primary
            disabled={!!submitDisabled}
            onClick={this.onSubmit}
            style={{ fontSize: '2.5rem' }}
          >
            Create my account!
          </Button>
          <Button
            transparent
            style={{
              fontSize: '1.5rem',
              marginRight: '1rem'
            }}
            onClick={showLoginForm}
          >
            Wait, I already have an account!
          </Button>
        </footer>
      </>
    );
  }

  onSubmit = async() => {
    const { signup } = this.props;
    const { username, password, firstname, lastname, email } = this.state;
    if (!isValidUsername(username)) {
      return this.setState({ errorMessage: 'That is not a valid username' });
    }
    if (!isValidPassword(password)) {
      return this.setState({
        errorMessage: 'Passwords need to be at least 5 characters long'
      });
    }
    if (!isValidRealname(firstname)) {
      return this.setState({ errorMessage: "That's not a valid name" });
    }
    if (!isValidRealname(lastname)) {
      return this.setState({ errorMessage: "That's not a valid last name" });
    }
    if (email && !isValidEmailAddress(email)) {
      return this.setState({ errorMessage: 'That email address is invalid' });
    }
    try {
      await signup({
        username,
        password,
        firstname,
        lastname,
        email
      });
    } catch (error) {
      this.setState({ errorMessage: error });
    }
  };
}

function isValidEmailAddress(email) {
  let regex =
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  let pattern = new RegExp(regex);
  return pattern.test(email);
}

function isValidRealname(realName) {
  var pattern = new RegExp(/^[a-zA-Z]+$/);
  return pattern.test(realName);
}

function isValidUsername(username) {
  var pattern = new RegExp(/^[a-zA-Z0-9]+$/);
  return (
    !!username &&
    username.length < 20 &&
    username.length > 3 &&
    pattern.test(username)
  );
}

function isValidPassword(password) {
  return password.length > 4 && !stringIsEmpty(password);
}
