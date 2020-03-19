import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Channel from './Channel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { useChatContext } from 'contexts';

Channels.propTypes = {
  channelLoadMoreButton: PropTypes.bool,
  channelsLoading: PropTypes.bool,
  onChannelEnter: PropTypes.func.isRequired,
  onLoadMoreChannels: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number
};

function Channels({
  channelLoadMoreButton,
  channelsLoading,
  onChannelEnter,
  onLoadMoreChannels,
  selectedChannelId
}) {
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
            chatType={chatType}
            onChannelEnter={onChannelEnter}
            selectedChannelId={selectedChannelId}
          />
        ))}
      {channelLoadMoreButton && (
        <LoadMoreButton
          color="green"
          filled
          loading={channelsLoading}
          onClick={onLoadMoreChannels}
          style={{
            width: '100%',
            borderRadius: 0,
            border: 0
          }}
        />
      )}
    </>
  );
}

export default memo(Channels);
