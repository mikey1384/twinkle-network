import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { timeSince } from 'helpers/timeStampHelpers';

export default class BasicInfos extends Component {
  static propTypes = {
    email: PropTypes.string,
    joinDate: PropTypes.string,
    lastActive: PropTypes.string,
    myId: PropTypes.number,
    selectedTheme: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    youtube: PropTypes.string,
    style: PropTypes.object
  };
  render() {
    const {
      email,
      joinDate,
      lastActive,
      myId,
      selectedTheme,
      userId,
      username,
      youtube,
      style
    } = this.props;
    return (
      <div style={style}>
        <div
          style={{
            color: Color[selectedTheme](),
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}
        >
          About {username}
        </div>
        {(email || youtube) && (
          <div style={{ textAlign: 'center' }}>
            {email && (
              <div>
                <span>Email: </span>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            )}
            {youtube && (
              <div>
                <span>YouTube: </span>
                <a href={youtube}>
                  {youtube?.split('www.')[1] || youtube?.split('www.')[0]}
                </a>
              </div>
            )}
          </div>
        )}
        {myId === userId ? (
          <Button style={{ marginTop: '1rem' }} transparent>
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '0.7rem' }}>Edit</span>
          </Button>
        ) : (
          <div
            style={{
              marginTop: email || youtube ? '2rem' : 0,
              textAlign: 'center'
            }}
          >
            <div>Became a member {timeSince(joinDate)}</div>
            <div>Was last active {timeSince(lastActive)}</div>
          </div>
        )}
      </div>
    );
  }
}
