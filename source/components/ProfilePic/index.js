import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { borderRadius, Color, innerBorderRadius } from 'constants/css';
import { connect } from 'react-redux';
import ChangePicture from './ChangePicture';

class ProfilePic extends Component {
  static propTypes = {
    className: PropTypes.string,
    isProfilePage: PropTypes.bool,
    large: PropTypes.bool,
    myId: PropTypes.number,
    onClick: PropTypes.func,
    online: PropTypes.bool,
    profilePicId: PropTypes.number,
    style: PropTypes.object,
    userId: PropTypes.number
  };

  state = {
    changePictureShown: false
  };

  render() {
    const {
      className,
      isProfilePage,
      large,
      myId,
      onClick = () => {},
      userId,
      online,
      profilePicId,
      style
    } = this.props;
    const { changePictureShown } = this.state;
    const src = `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${userId}/${profilePicId}.jpg`;
    return (
      <div
        className={className}
        style={{
          display: 'block',
          position: 'relative',
          userSelect: 'none',
          borderRadius: '50%',
          cursor: myId === userId && isProfilePage ? 'pointer' : 'default',
          ...style
        }}
        onClick={onClick}
        onMouseEnter={() => this.setState({ changePictureShown: true })}
        onMouseLeave={() => this.setState({ changePictureShown: false })}
      >
        <img
          alt="Thumbnail"
          style={{
            display: 'block',
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%'
          }}
          src={profilePicId ? src : '/img/default.png'}
        />
        {myId === userId &&
          isProfilePage &&
          changePictureShown && <ChangePicture />}
        {myId !== userId &&
          large &&
          online && (
            <div
              style={{
                top: '74%',
                left: '70%',
                background: '#fff',
                position: 'absolute',
                border: '3px solid #fff',
                borderRadius
              }}
            >
              <div
                style={{
                  background: Color.green(),
                  color: '#fff',
                  padding: '0.3rem',
                  borderRadius: innerBorderRadius,
                  fontWeight: 'bold'
                }}
              >
                online
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default connect(state => ({
  myId: state.UserReducer.userId
}))(ProfilePic);
