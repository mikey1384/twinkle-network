import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import Input from 'components/Texts/Input';
import Banner from 'components/Banner';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useContentContext } from 'contexts';

LoginForm.propTypes = {
  username: PropTypes.string,
  onSetUsername: PropTypes.func.isRequired,
  onShowForgotPasswordForm: PropTypes.func,
  onShowSignupForm: PropTypes.func
};

export default function LoginForm({
  username,
  onSetUsername,
  onShowForgotPasswordForm,
  onShowSignupForm
}) {
  const {
    user: {
      actions: { onLogin }
    },
    requestHelpers: { login }
  } = useAppContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <ErrorBoundary>
      {errorMessage && <Banner color="pink">{errorMessage}</Banner>}
      <main>
        <div style={{ width: '100%' }}>
          <div>
            <Input
              name="username"
              value={username}
              onChange={text => {
                setErrorMessage('');
                onSetUsername(text);
              }}
              placeholder="Enter your username"
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
            <div
              style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}
            >
              <span
                style={{
                  fontWeight: 'bold',
                  color: Color.blue(),
                  cursor: 'pointer'
                }}
                className={css`
                  &:hover {
                    text-decoration: underline;
                  }
                `}
                onClick={onShowForgotPasswordForm}
              >{`I forgot my password!`}</span>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Button
          style={{
            fontSize: '1.5rem',
            marginRight: '1.5rem'
          }}
          color="orange"
          transparent
          onClick={onShowSignupForm}
        >
          {"Wait, I don't think I have an account, yet"}
        </Button>
        <Button
          color="blue"
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
      const data = await login({ username, password });
      onLogin(data);
      onInitContent({ contentType: 'user', contentId: data.id, ...data });
    } catch (error) {
      setErrorMessage(error);
    }
  }
}
