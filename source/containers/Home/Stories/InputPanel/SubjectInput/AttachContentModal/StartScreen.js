import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

export default class StartScreen extends Component {
  static propTypes = {
    navigateTo: PropTypes.func.isRequired
  };

  render() {
    const { navigateTo } = this.props;
    return (
      <div
        style={{
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <Button
          style={{ fontSize: '2rem' }}
          logo
          onClick={() => navigateTo('selectVideo')}
        >
          Video
        </Button>
        <Button
          style={{ fontSize: '2rem', marginLeft: '1rem' }}
          warning
          onClick={() => navigateTo('selectLink')}
        >
          Webpage
        </Button>
      </div>
    );
  }
}
