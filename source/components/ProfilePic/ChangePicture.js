import React, { Component } from 'react';
import { Color } from 'constants/css';
import Icon from 'components/Icon';

export default class ChangePicture extends Component {
  state = {
    style: {}
  };

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          style: {
            background: Color.black(0.8)
          }
        }),
      0
    );
  }

  componentWillUnmount() {
    this.setState({ style: {} });
  }

  render() {
    const { style } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '50%',
          marginTop: '50%',
          position: 'absolute',
          borderBottomRightRadius: '11rem',
          borderBottomLeftRadius: '11rem',
          transition: 'background 0.5s',
          ...style
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Icon icon="camera-alt" size="lg" />
          <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
            Change Picture
          </div>
        </div>
      </div>
    );
  }
}
