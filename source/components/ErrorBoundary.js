import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StackTrace from 'stacktrace-js';
import { Color } from 'constants/css';
import { clientVersion } from 'constants/defaultValues';
import URL from 'constants/URL';

const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

const auth = () => ({
  headers: {
    authorization: token()
  }
});

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    userId: PropTypes.number,
    username: PropTypes.string
  };

  state = { hasError: false };

  async componentDidCatch(error, info) {
    this.setState({ hasError: true });
    const errorStack = await StackTrace.fromError(error);
    await StackTrace.report(errorStack, `${URL}/user/error`, {
      clientVersion,
      message: error.message,
      info: info?.componentStack,
      token: auth()?.headers?.authorization
    });
    console.log(error);
  }

  render() {
    const { children, ...props } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div
          style={{
            color: Color.darkerGray(),
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            height: '30%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Something went wrong
        </div>
      );
    }
    return Object.keys(props).length > 0 ? (
      <div {...props}>{children}</div>
    ) : (
      <>{children}</>
    );
  }
}
