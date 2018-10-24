import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import InforEditForm from './InfoEditForm';
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
    youtubeUrl: PropTypes.string,
    style: PropTypes.object
  };

  state = {
    onEdit: false
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
      youtubeUrl,
      style
    } = this.props;
    const { onEdit } = this.state;
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
        {onEdit && (
          <InforEditForm
            email={email}
            youtubeUrl={youtubeUrl}
            onCancel={() => this.setState({ onEdit: false })}
            onSubmit={() => this.setState({ onEdit: false })}
          />
        )}
        {!onEdit &&
          (email || youtubeUrl) && (
            <div style={{ textAlign: 'center' }}>
              {email && (
                <div>
                  <span>Email: </span>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              )}
              {youtubeUrl && (
                <div>
                  <span>YouTube: </span>
                  <a href={youtubeUrl}>
                    {youtubeUrl?.split('www.')[1] ||
                      youtubeUrl?.split('www.')[0]}
                  </a>
                </div>
              )}
            </div>
          )}
        {!onEdit &&
          myId === userId &&
          (!email || !youtubeUrl) && (
            <div
              style={{
                textAlign: 'center',
                marginTop: email || youtubeUrl ? '1rem' : 0
              }}
            >
              Add your{' '}
              <span>
                {[
                  { label: 'email', value: email },
                  { label: 'YouTube', value: youtubeUrl }
                ]
                  .filter(item => !item.value)
                  .map(item => item.label)
                  .join(' and ')}
              </span>
              <span>{` address${
                email || youtubeUrl ? '' : 'es'
              } by tapping the "Edit" button below`}</span>
            </div>
          )}
        {myId === userId ? (
          !onEdit ? (
            <Button
              style={{ marginTop: '1rem' }}
              transparent
              onClick={() => this.setState({ onEdit: true })}
            >
              <Icon icon="pencil-alt" />
              <span style={{ marginLeft: '0.7rem' }}>Edit</span>
            </Button>
          ) : null
        ) : (
          <div
            style={{
              marginTop: email || youtubeUrl ? '2rem' : 0,
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
