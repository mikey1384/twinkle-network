import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { connect } from 'react-redux';
import ProfilePic from 'components/ProfilePic';

class Cover extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      statusColor: PropTypes.string.isRequired
    }),
    userId: PropTypes.number
  };
  render() {
    const {
      userId,
      profile: { id, profilePicId, online, statusColor, realName, username }
    } = this.props;
    return (
      <>
        <div
          style={{
            background: Color[statusColor](),
            height: '24rem',
            marginTop: '-1rem',
            width: '100%'
          }}
        >
          <div
            style={{
              marginLeft: '35rem',
              color: '#fff',
              fontSize: '5rem',
              paddingTop: '10rem'
            }}
          >
            {username}
            <p style={{ fontSize: '2rem', lineHeight: '1rem' }}>({realName})</p>
          </div>
        </div>
        <ProfilePic
          style={{
            position: 'absolute',
            width: '25rem',
            height: '25rem',
            left: '5rem',
            top: '4rem',
            fontSize: '2rem',
            zIndex: 10
          }}
          userId={id}
          profilePicId={profilePicId}
          online={userId === id || !!online}
          large
        />
      </>
    );
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Cover);
