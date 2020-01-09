import React, { useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FullTextReveal from 'components/Texts/FullTextReveal';
import Members from './Members';
import { css } from 'emotion';
import { Color, mobileMaxWidth, phoneMaxWidth } from 'constants/css';
import { isMobile, textIsOverflown } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';

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
  const {
    state: { customChannelNames }
  } = useChatContext();
  const ChannelNameRef = useRef(null);
  const MenuRef = useRef(null);
  const [channelNameHovered, setChannelNameHovered] = useState(false);
  const { userId: myId, username, profilePicId } = useMyState();
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

  useEffect(() => {
    MenuRef.current.scrollTop = 0;
  }, [currentChannel.id]);

  return (
    <div
      ref={MenuRef}
      className={css`
        width: 20vw;
        position: relative;
        background: #fff;
        border-left: 1px solid ${Color.borderGray()};
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${phoneMaxWidth}) {
          width: 45vw;
        }
      `}
    >
      <div
        className={css`
          width: 100%;
          display: flex;
          margin-top: 1rem;
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
        >
          <div
            onClick={() => setChannelNameHovered(hovered => !hovered)}
            className={css`
              width: 100%;
              line-height: 1.5;
              padding: 0 1rem 0 1rem;
              font-size: 2.5rem;
              font-weight: bold;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 1.7rem;
              }
            `}
          >
            <p
              ref={ChannelNameRef}
              style={{
                width: '100%',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                cursor: 'default'
              }}
              onMouseEnter={handleMouseOver}
              onMouseLeave={() => setChannelNameHovered(false)}
            >
              {customChannelNames[currentChannel.id] || channelName}
            </p>
            <FullTextReveal
              style={{ width: '100%', fontSize: '1.5rem' }}
              show={channelNameHovered}
              direction="left"
              text={channelName || ''}
            />
          </div>
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
    </div>
  );

  function handleMouseOver() {
    if (textIsOverflown(ChannelNameRef.current) && !isMobile(navigator)) {
      setChannelNameHovered(true);
    }
  }
}
