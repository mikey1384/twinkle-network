import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChannelDetail from './ChannelDetail';
import Button from 'components/Button';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Invitation.propTypes = {
  inviteFrom: PropTypes.number.isRequired,
  messageId: PropTypes.number.isRequired,
  sender: PropTypes.object.isRequired
};

export default function Invitation({ inviteFrom, messageId, sender }) {
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
      const { channel } = await loadChatChannel({ channelId: inviteFrom });
      onSetChatInvitationDetail({ messageId, detail: channel });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {invitationDetail && (
        <ChannelDetail
          channelName={invitationDetail.channelName}
          members={invitationDetail.members}
        />
      )}
      {userId !== sender.id && (
        <Button filled color={profileTheme} onClick={handleAccept}>
          {`Accept ${sender.username}'s Invitation`}
        </Button>
      )}
    </div>
  );

  async function handleAccept() {
    const { channel, message } = await acceptInvitation(inviteFrom);
    console.log(channel, message);
  }
}
