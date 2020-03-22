import React, { memo, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useChatContext } from 'contexts';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

MemberListItem.propTypes = {
  onlineMembers: PropTypes.object,
  creatorId: PropTypes.number,
  isClass: PropTypes.bool,
  member: PropTypes.object,
  style: PropTypes.object
};

function MemberListItem({ onlineMembers, creatorId, isClass, member, style }) {
  const { profileTheme } = useMyState();
  const {
    state: {
      ['user' + member.id]: {
        isAway,
        isBusy,
        id: userId,
        profilePicId,
        username
      } = {}
    },
    actions: { onSetUserData }
  } = useChatContext();

  useEffect(() => {
    onSetUserData(member);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  const usernameWidth = useMemo(() => (isClass ? '20%' : '45%'), [isClass]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        padding: '1rem',
        ...style
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ProfilePic
          className={css`
            height: 4rem;
            width: 4rem;
            @media (max-width: ${mobileMaxWidth}) {
              height: 3rem;
              width: 3rem;
            }
          `}
          userId={userId}
          profilePicId={profilePicId}
          online={!!onlineMembers[userId]}
          isAway={isAway}
          isBusy={isBusy}
          statusShown
        />
        <UsernameText
          truncate
          className={css`
            width: auto;
            max-width: ${creatorId === userId
              ? usernameWidth
              : `CALC(${usernameWidth} + 3rem)`};
          `}
          style={{
            color: Color.darkerGray(),
            marginLeft: '2rem'
          }}
          user={{ id: userId, username }}
        />
        {creatorId === userId ? (
          <div
            style={{
              marginLeft: '1rem'
            }}
          >
            <Icon icon="crown" style={{ color: Color.brownOrange() }} />
          </div>
        ) : null}
        {isClass && (
          <Button
            style={{ fontSize: '1rem', marginLeft: '1rem' }}
            filled
            color={profileTheme}
            onClick={handleShowPeer}
          >
            Show
          </Button>
        )}
      </div>
    </div>
  );

  function handleShowPeer() {
    socket.emit('request_peer_stream', userId);
  }
}

export default memo(MemberListItem);
