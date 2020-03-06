import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Members from './Members';
import ChannelDetails from './ChannelDetails';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color, desktopMinWidth, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';
import { socket } from 'constants/io';

ChatInfo.propTypes = {
  channelName: PropTypes.string,
  channelOnCall: PropTypes.object,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.array.isRequired,
  selectedChannelId: PropTypes.number
};

function ChatInfo({
  selectedChannelId,
  channelOnCall,
  currentChannel,
  currentChannelOnlineMembers,
  channelName
}) {
  const { userId: myId, username, profilePicId, authLevel } = useMyState();
  const {
    actions: { onCall }
  } = useChatContext();
  const canVideoChat = useMemo(() => {
    if (currentChannel.twoPeople) {
      let result = true;
      for (let member of currentChannel.members || []) {
        if (!member?.authLevel) result = false;
      }
      return result;
    }
    return currentChannel.isClass && authLevel > 0;
  }, [
    authLevel,
    currentChannel.isClass,
    currentChannel.members,
    currentChannel.twoPeople
  ]);
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

  const callConnected = useMemo(() => selectedChannelId === channelOnCall.id, [
    channelOnCall.id,
    selectedChannelId
  ]);

  const disabled = useMemo(() => currentChannelOnlineMembers.length <= 1, [
    currentChannelOnlineMembers.length
  ]);

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
          {canVideoChat && (
            <div
              className={css`
                padding: 1rem;
                background: ${disabled
                  ? Color.darkBlue(0.4)
                  : callConnected
                  ? Color.rose(0.8)
                  : Color.darkBlue(0.8)};
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: ${currentChannelOnlineMembers.length > 1
                  ? 'pointer'
                  : 'default'};
                transition: background 0.2s;
                @media (max-width: ${mobileMaxWidth}) {
                  background: ${disabled
                    ? Color.darkBlue(0.4)
                    : callConnected
                    ? Color.rose(1)
                    : Color.darkBlue(1)};
                }
                @media (min-width: ${desktopMinWidth}) {
                  &:hover {
                    background: ${disabled
                      ? Color.darkBlue(0.4)
                      : callConnected
                      ? Color.rose(1)
                      : Color.darkBlue(1)};
                  }
                }
              `}
              onClick={handleCall}
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

  function handleCall() {
    if (disabled) return;
    if (selectedChannelId === channelOnCall.id) {
      socket.emit('hang_up_call', {
        channelId: channelOnCall.id,
        peerId: myId
      });
    }
    onCall(
      selectedChannelId !== channelOnCall.id
        ? {
            callerId: myId,
            channelId: currentChannel.id
          }
        : {}
    );
  }
}

export default memo(ChatInfo);
