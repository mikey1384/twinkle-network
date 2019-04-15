import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Button from 'components/Button';
import { stringIsEmpty, trimWhiteSpaces } from 'helpers/stringHelpers';
import Input from 'components/Texts/Input';
import { css } from 'emotion';
import { Color } from 'constants/css';
import Banner from 'components/Banner';

SignUpForm.propTypes = {
  signup: PropTypes.func.isRequired,
  showLoginForm: PropTypes.func.isRequired
};

export default function SignUpForm({ showLoginForm, signup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [keyphrase, setKeyphrase] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const submitDisabled =
    stringIsEmpty(username) ||
    stringIsEmpty(password) ||
    stringIsEmpty(firstname) ||
    stringIsEmpty(lastname) ||
    stringIsEmpty(keyphrase);
  errorMessage;

  return (
    <ErrorBoundary>
      {errorMessage && <Banner>{errorMessage}</Banner>}
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
                setErrorMessage('');
                setUsername(trimWhiteSpaces(text));
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  onSubmit();
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
                setErrorMessage('');
                setPassword(text);
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  onSubmit();
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
                setErrorMessage('');
                setFirstname(trimWhiteSpaces(text));
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  onSubmit();
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
                setErrorMessage('');
                setLastname(trimWhiteSpaces(text));
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  onSubmit();
                }
              }}
              type="text"
            />
          </section>
          <section>
            <label>Who is Cheesestick?</label>
            <Input
              value={keyphrase}
              placeholder="Who is Cheesestick?"
              onChange={text => {
                setErrorMessage('');
                setKeyphrase(text);
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  onSubmit();
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
                setErrorMessage('');
                setEmail(text);
              }}
              onKeyPress={event => {
                if (event.key === 'Enter' && !submitDisabled) {
                  onSubmit();
                }
              }}
              type="email"
            />
          </section>
        </div>
      </main>
      <footer>
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
        <Button
          color="blue"
          disabled={!!submitDisabled}
          onClick={onSubmit}
          style={{ fontSize: '2.5rem' }}
        >
          Create my account!
        </Button>
      </footer>
    </ErrorBoundary>
  );

  async function onSubmit() {
    if (!isValidUsername(username)) {
      return setErrorMessage('That is not a valid username');
    }
    if (!isValidPassword(password)) {
      return setErrorMessage('Passwords need to be at least 5 characters long');
    }
    if (!isValidRealname(firstname)) {
      return setErrorMessage("That's not a valid name");
    }
    if (!isValidRealname(lastname)) {
      return setErrorMessage("That's not a valid last name");
    }
    if (email && !isValidEmailAddress(email)) {
      return setErrorMessage("That's not a valid email address");
    }
    try {
      await signup({
        username,
        password,
        firstname,
        keyphrase,
        lastname,
        email
      });
    } catch (error) {
      setErrorMessage(error);
    }
  }
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
  var pattern = new RegExp(/^[a-zA-Z0-9_]+$/);
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
