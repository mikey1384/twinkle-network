import React, { memo, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import Icon from 'components/Icon';
import Button from 'components/Button';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { useChatContext } from 'contexts';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

MemberListItem.propTypes = {
  channelId: PropTypes.number,
  onlineMembers: PropTypes.object,
  creatorId: PropTypes.number,
  imLive: PropTypes.bool,
  isClass: PropTypes.bool,
  member: PropTypes.object,
  membersOnCallObj: PropTypes.object,
  peerStreams: PropTypes.object,
  style: PropTypes.object
};

function MemberListItem({
  channelId,
  onlineMembers,
  creatorId,
  imLive,
  isClass,
  membersOnCallObj,
  member,
  peerStreams,
  style
}) {
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const { userId: myId } = useMyState();
  const {
    state: {
      channelOnCall,
      ['user' + member.id]: {
        isAway,
        isBusy,
        id: memberId,
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
  const peerIsStreaming = useMemo(
    () =>
      peerStreams?.[membersOnCallObj?.[memberId]] &&
      !channelOnCall.members[membersOnCallObj?.[memberId]]?.streamHidden,
    [peerStreams, membersOnCallObj, memberId, channelOnCall.members]
  );

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
          userId={memberId}
          profilePicId={profilePicId}
          online={!!onlineMembers[memberId]}
          isAway={isAway}
          isBusy={isBusy}
          statusShown
        />
        <UsernameText
          truncate
          className={css`
            width: auto;
            max-width: ${creatorId === memberId
              ? usernameWidth
              : `CALC(${usernameWidth} + 3rem)`};
          `}
          style={{
            color: Color.darkerGray(),
            marginLeft: '2rem'
          }}
          user={{ id: memberId, username }}
        />
        {creatorId === memberId ? (
          <div
            style={{
              marginLeft: '1rem'
            }}
          >
            <Icon icon="crown" style={{ color: Color.brownOrange() }} />
          </div>
        ) : null}
        {isClass && imLive && creatorId === myId && memberId !== myId && (
          <Button
            style={{ fontSize: '1rem', marginLeft: '1rem' }}
            filled
            color={peerIsStreaming ? 'rose' : 'darkBlue'}
            onClick={handleShowPeer}
          >
            {peerIsStreaming ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Showing over 2 students at a time may slow down the performance or cause errors"
          onConfirm={handleConfirmShowPeer}
        />
      )}
    </div>
  );

  function handleConfirmShowPeer() {
    socket.emit('request_peer_stream', memberId);
    setConfirmModalShown(false);
  }

  function handleShowPeer() {
    if (peerIsStreaming) {
      socket.emit('close_peer_stream', {
        memberId,
        channelId
      });
    } else {
      const numLivePeers = Object.keys(peerStreams)?.filter(
        peerId => !channelOnCall.members[peerId]?.streamHidden
      ).length;
      if (numLivePeers >= 2) {
        return setConfirmModalShown(true);
      }
      socket.emit('request_peer_stream', memberId);
    }
  }
}

export default memo(MemberListItem);
