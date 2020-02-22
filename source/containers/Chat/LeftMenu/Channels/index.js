import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Channel from './Channel';
import { useChatContext } from 'contexts';

Channels.propTypes = {
  userId: PropTypes.number.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number
};

function Channels({ userId, onChannelEnter, selectedChannelId }) {
  const {
    state: { chatType, channelIds, channelsObj, customChannelNames }
  } = useChatContext();

  return (
    <>
      {channelIds
        .map(channelId => channelsObj[channelId])
        .filter(channel => !channel?.isHidden)
        .map(channel => (
          <Channel
            key={channel.id}
            channel={channel}
            customChannelNames={customChannelNames}
            userId={userId}
            chatType={chatType}
            onChannelEnter={onChannelEnter}
            selectedChannelId={selectedChannelId}
          />
        ))}
    </>
  );
}

export default memo(Channels);
