import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { reportBug } from 'helpers/requestHelpers';

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    userId: PropTypes.number,
    username: PropTypes.string
  };

  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    reportBug({ message: error.message, info: info?.componentStack });
    console.log(error);
  }

  render() {
    const { children, ...props } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div
          style={{
            color: Color.darkGray(),
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
