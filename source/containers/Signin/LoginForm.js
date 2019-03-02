import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { stringIsEmpty } from 'helpers/stringHelpers';
import Input from 'components/Texts/Input';
import Banner from 'components/Banner';

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  showSignUpForm: PropTypes.func.isRequired
};

export default function LoginForm({ login, showSignUpForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <ErrorBoundary>
      {errorMessage && <Banner love>{errorMessage}</Banner>}
      <main>
        <div style={{ width: '100%' }}>
          <div>
            <Input
              name="username"
              value={username}
              onChange={text => {
                setErrorMessage('');
                setUsername(text);
              }}
              placeholder="Enter your username"
              type="text"
              onKeyPress={event => {
                if (
                  !stringIsEmpty(username) &&
                  !stringIsEmpty(password) &&
                  event.key === 'Enter'
                ) {
                  onSubmit();
                }
              }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Input
              name="password"
              value={password}
              onChange={text => {
                setErrorMessage('');
                setPassword(text);
              }}
              placeholder="Enter your password"
              type="password"
              onKeyPress={event => {
                if (
                  !stringIsEmpty(username) &&
                  !stringIsEmpty(password) &&
                  event.key === 'Enter'
                ) {
                  onSubmit();
                }
              }}
            />
          </div>
        </div>
      </main>
      <footer>
        <Button
          style={{
            fontSize: '1.5rem',
            marginRight: '1.5rem'
          }}
          transparent
          onClick={showSignUpForm}
        >
          {"Wait, I don't think I have an account, yet"}
        </Button>
        <Button
          primary
          style={{ fontSize: '2.5rem' }}
          disabled={stringIsEmpty(username) || stringIsEmpty(password)}
          onClick={onSubmit}
        >
          Log me in!
        </Button>
      </footer>
    </ErrorBoundary>
  );

  async function onSubmit() {
    try {
      await login({ username, password });
    } catch (error) {
      setErrorMessage(error);
    }
  }
}
