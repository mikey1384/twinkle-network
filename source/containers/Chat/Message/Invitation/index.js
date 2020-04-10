import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChannelDetail from './ChannelDetail';
import { useContentState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Invitation.propTypes = {
  inviteFrom: PropTypes.number.isRequired,
  messageId: PropTypes.number.isRequired
};

export default function Invitation({ inviteFrom, messageId }) {
  const { invitationDetail } = useContentState({
    contentType: 'chat',
    contentId: messageId
  });
  const {
    requestHelpers: { loadChatChannel }
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
      <div>{inviteFrom}</div>
    </div>
  );
}
