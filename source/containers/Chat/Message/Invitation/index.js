import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ChannelDetail from './ChannelDetail';
import Button from 'components/Button';
import { socket } from 'constants/io';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Invitation.propTypes = {
  inviteFrom: PropTypes.number.isRequired,
  messageId: PropTypes.number.isRequired,
  onAcceptGroupInvitation: PropTypes.func.isRequired,
  onSetScrollToBottom: PropTypes.func.isRequired,
  sender: PropTypes.object.isRequired
};

export default function Invitation({
  inviteFrom,
  messageId,
  onAcceptGroupInvitation,
  sender,
  onSetScrollToBottom
}) {
  const { userId, profileTheme } = useMyState();
  const { invitationDetail } = useContentState({
    contentType: 'chat',
    contentId: messageId
  });
  const {
    requestHelpers: { acceptInvitation, loadChatChannel }
  } = useAppContext();
  const {
    actions: { onSetChatInvitationDetail }
  } = useContentContext();
  useEffect(() => {
    if (!invitationDetail) {
      init();
    }
    async function init() {
      const { channel } = await loadChatChannel({
        channelId: inviteFrom,
        skipUpdateChannelId: true
      });
      onSetChatInvitationDetail({ messageId, detail: channel });
      onSetScrollToBottom();
    }
    return function cleanUp() {
      onSetChatInvitationDetail({ messageId, detail: null });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const alreadyJoined = useMemo(() => {
    const memberIds = invitationDetail?.members.map((member) => member.id);
    return memberIds?.includes(userId);
  }, [invitationDetail, userId]);

  const desktopHeight = useMemo(() => {
    if (userId === sender.id) {
      if (invitationDetail?.members?.length > 3) {
        return '9rem';
      } else {
        return '7rem';
      }
    } else {
      if (invitationDetail?.members?.length > 3) {
        return '14rem';
      } else {
        return '12rem';
      }
    }
  }, [invitationDetail, sender.id, userId]);

  const mobileHeight = useMemo(() => {
    if (userId === sender.id) {
      if (invitationDetail?.members?.length > 3) {
        return '7rem';
      } else {
        return '5rem';
      }
    } else {
      if (invitationDetail?.members?.length > 3) {
        return '12rem';
      } else {
        return '10rem';
      }
    }
  }, [invitationDetail, sender.id, userId]);

  return (
    <div
      className={css`
        height: ${desktopHeight};
        @media (max-width: ${mobileMaxWidth}) {
          height: ${mobileHeight};
        }
      `}
    >
      {invitationDetail && (
        <ChannelDetail
          channelName={invitationDetail.channelName}
          members={invitationDetail.members}
        />
      )}
      {userId !== sender.id && (
        <Button
          filled
          color={profileTheme}
          onClick={handleAccept}
          disabled={alreadyJoined}
        >
          {alreadyJoined
            ? 'Already Joined'
            : `Accept ${sender.username}'s Invitation`}
        </Button>
      )}
    </div>
  );

  async function handleAccept() {
    const { channel, messages, joinMessage } = await acceptInvitation(
      inviteFrom
    );
    socket.emit('join_chat_group', channel.id);
    onAcceptGroupInvitation({ channel, messages, joinMessage });
  }
}
