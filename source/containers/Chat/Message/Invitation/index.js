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
  sender: PropTypes.object.isRequired
};

export default function Invitation({
  inviteFrom,
  messageId,
  onAcceptGroupInvitation,
  sender
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

  return (
    <div
      className={css`
        height: ${userId === sender.id ? '8rem' : '14rem'};
        @media (max-width: ${mobileMaxWidth}) {
          height: ${userId === sender.id ? '6rem' : '12rem'};
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
