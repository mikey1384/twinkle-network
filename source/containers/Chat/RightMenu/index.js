import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

RightMenu.propTypes = {
  channelName: PropTypes.string,
  currentChannel: PropTypes.object,
  currentChannelOnlineMembers: PropTypes.array
};

export default function RightMenu({
  channelName,
  currentChannel,
  currentChannelOnlineMembers
}) {
  const totalChannelMembers = currentChannel?.members || [];
  const membersOnline = useMemo(
    () =>
      `${currentChannelOnlineMembers.length || 1}${
        totalChannelMembers.length <= 1 ? '' : '/' + totalChannelMembers.length
      }`,
    [currentChannelOnlineMembers.length, totalChannelMembers.length]
  );

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 30rem;
        position: relative;
        background: #fff;
        border-left: 1px solid ${Color.borderGray()};
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${mobileMaxWidth}) {
          width: 25%;
        }
      `}
    >
      <div
        style={{
          width: '100%',
          fontWeight: 'bold',
          display: 'flex',
          marginTop: '1rem',
          fontSize: '2.5rem',
          justifyContent: 'center',
          color: Color.darkerGray()
        }}
      >
        {channelName}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: Color.green()
        }}
      >
        {membersOnline} online
      </div>
      <div>
        {totalChannelMembers.map(member => (
          <div
            key={member.id}
            style={{ display: 'flex', width: '100%', padding: '1rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ProfilePic
                style={{ height: '5rem', width: '5rem' }}
                userId={member.id}
                profilePicId={member.profilePicId}
                online={currentChannelOnlineMembers.includes(member.id)}
                statusShown
              />
              <div style={{ marginLeft: '1rem' }}>{member.username}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
