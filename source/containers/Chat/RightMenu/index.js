import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import FullTextReveal from 'components/Texts/FullTextReveal';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { isMobile, textIsOverflown } from 'helpers';
import { useMyState } from 'helpers/hooks';

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
  const ChannelNameRef = useRef(null);
  const [channelNameHovered, setChannelNameHovered] = useState(false);
  const { userId: myId, username, profilePicId } = useMyState();
  const displayedChannelMembers = useMemo(() => {
    const totalChannelMembers = currentChannel?.members || [];
    const me = { id: myId, username, profilePicId };
    const currentChannelOnlineMembersOtherThanMe = currentChannelOnlineMembers.filter(
      member => !!member.id && member.id !== myId
    );
    const totalValidChannelMembers = totalChannelMembers.filter(
      member => member.id !== 0
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
          width: 45vw;
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
        <div
          onClick={() => setChannelNameHovered(hovered => !hovered)}
          style={{ width: '100%', padding: '0 1rem 0 1rem' }}
        >
          <p
            ref={ChannelNameRef}
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              cursor: 'default'
            }}
            onMouseEnter={handleMouseOver}
            onMouseLeave={() => setChannelNameHovered(false)}
          >
            {channelName}
          </p>
          <FullTextReveal
            style={{ fontSize: '1.5rem' }}
            show={channelNameHovered}
            direction="left"
            text={channelName || ''}
          />
        </div>
      </div>
      <div
        className={css`
          overflow: scroll;
          margin-top: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: 3rem;
          }
        `}
      >
        {displayedChannelMembers.map((member, index) => (
          <div
            key={member.id}
            style={{
              display: 'flex',
              width: '100%',
              padding: '1rem',
              paddingBottom:
                index === displayedChannelMembers.length - 1 ? '15rem' : '1rem'
            }}
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
                online={currentChannelOnlineMembers
                  .map(member => member.id)
                  .includes(member.id)}
                statusShown
              />
              <div
                style={{
                  color: Color.darkerGray(),
                  marginLeft: '2rem'
                }}
              >
                <UsernameText user={member} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function handleMouseOver() {
    if (textIsOverflown(ChannelNameRef.current) && !isMobile(navigator)) {
      setChannelNameHovered(true);
    }
  }
}
