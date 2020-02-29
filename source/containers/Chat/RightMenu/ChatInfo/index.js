import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Members from './Members';
import ChannelDetails from './ChannelDetails';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color, desktopMinWidth, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';

ChatInfo.propTypes = {
  channelName: PropTypes.string,
  channelOnCall: PropTypes.object,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.array.isRequired,
  selectedChannelId: PropTypes.number
};

export default function ChatInfo({
  selectedChannelId,
  channelOnCall,
  currentChannel,
  currentChannelOnlineMembers,
  channelName
}) {
  const { authLevel, userId: myId, username, profilePicId } = useMyState();
  console.log(authLevel);
  const {
    actions: { onCall }
  } = useChatContext();
  const displayedChannelMembers = useMemo(() => {
    const totalChannelMembers = currentChannel?.members || [];
    const me = { id: myId, username, profilePicId };
    const currentChannelOnlineMembersOtherThanMe = currentChannelOnlineMembers.filter(
      member => !!member.id && member.id !== myId
    );
    const totalValidChannelMembers = totalChannelMembers.filter(
      member => !!member.id
    );
    const currentlyOnlineIds = currentChannelOnlineMembers.map(
      member => member.id
    );
    if (totalValidChannelMembers.length > 0) {
      const offlineChannelMembers = totalValidChannelMembers.filter(
        member => !currentlyOnlineIds.includes(member.id) && member.id !== myId
      );
      return [
        me,
        ...currentChannelOnlineMembersOtherThanMe,
        ...offlineChannelMembers
      ];
    }
    return [me, ...currentChannelOnlineMembersOtherThanMe];
  }, [
    currentChannel,
    myId,
    username,
    profilePicId,
    currentChannelOnlineMembers
  ]);

  const currentlyOnlineValidMembers = useMemo(
    () => currentChannelOnlineMembers.filter(member => !!member.id),
    [currentChannelOnlineMembers]
  );

  return (
    <>
      <div
        className={css`
          width: 100%;
          display: flex;
          padding-bottom: 1rem;
          justify-content: center;
          color: ${Color.darkerGray()};
        `}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            width: '100%'
          }}
          className="unselectable"
        >
          {currentChannel.twoPeople && authLevel > 5 && (
            <div
              className={css`
                padding: 1rem;
                background: ${selectedChannelId !== channelOnCall.id
                  ? Color.darkBlue(0.8)
                  : Color.rose(0.8)};
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.2s;
                @media (max-width: ${mobileMaxWidth}) {
                  background: ${selectedChannelId !== channelOnCall.id
                    ? Color.darkBlue(1)
                    : Color.rose(1)};
                }
                @media (min-width: ${desktopMinWidth}) {
                  &:hover {
                    background: ${selectedChannelId !== channelOnCall.id
                      ? Color.darkBlue(1)
                      : Color.rose(1)};
                  }
                }
              `}
              onClick={() =>
                onCall(
                  selectedChannelId !== channelOnCall.id
                    ? {
                        callerId: myId,
                        channelId: currentChannel.id
                      }
                    : {}
                )
              }
            >
              {selectedChannelId !== channelOnCall.id && (
                <Icon icon="phone-volume" />
              )}
              <span style={{ marginLeft: '1rem' }}>
                {selectedChannelId !== channelOnCall.id ? 'Call' : 'Hang Up'}
              </span>
            </div>
          )}
          <ChannelDetails
            style={{ marginTop: '1rem' }}
            channelId={currentChannel.id}
            channelName={channelName}
          />
          {displayedChannelMembers.length > 2 && (
            <div
              className={css`
                color: ${Color.green()};
                font-size: 1.7rem;
                font-weight: bold;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
            >
              {currentlyOnlineValidMembers.length}
              {currentChannel.id !== 2 &&
                '/' + displayedChannelMembers.length}{' '}
              online
            </div>
          )}
        </div>
      </div>
      <Members
        channelId={currentChannel.id}
        creatorId={currentChannel.creatorId}
        members={displayedChannelMembers}
        onlineMembers={currentChannelOnlineMembers}
      />
    </>
  );
}
