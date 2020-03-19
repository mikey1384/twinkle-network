import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Channel from './Channel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext, useChatContext } from 'contexts';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';

Channels.propTypes = {
  channelLoadMoreButton: PropTypes.bool,
  onChannelEnter: PropTypes.func.isRequired
};

function Channels({ channelLoadMoreButton, onChannelEnter }) {
  const {
    requestHelpers: { loadMoreChannels }
  } = useAppContext();
  const {
    state: {
      chatType,
      channelsObj,
      customChannelNames,
      homeChannelIds,
      selectedChannelId
    },
    actions: { onLoadMoreChannels }
  } = useChatContext();
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [prevChannelIds, setPrevChannelIds] = useState(homeChannelIds);
  const ChannelListRef = useRef(null);
  const loading = useRef(false);

  useEffect(() => {
    const ChannelList = ChannelListRef.current;
    addEvent(ChannelList, 'scroll', onListScroll);

    function onListScroll() {
      if (
        channelLoadMoreButton &&
        ChannelListRef.current.scrollTop >=
          (ChannelListRef.current.scrollHeight -
            ChannelListRef.current.offsetHeight) *
            0.7
      ) {
        handleLoadMoreChannels();
      }
    }

    return function cleanUp() {
      removeEvent(ChannelList, 'scroll', onListScroll);
    };
  });

  useEffect(() => {
    if (
      selectedChannelId === homeChannelIds &&
      homeChannelIds[0] !== prevChannelIds[0]
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannelIds(homeChannelIds);
  }, [
    channelLoadMoreButton,
    homeChannelIds,
    selectedChannelId,
    prevChannelIds
  ]);

  return (
    <ErrorBoundary
      innerRef={ChannelListRef}
      style={{
        overflow: 'scroll',
        top: '17.5rem',
        width: '80%',
        height: '100%'
      }}
    >
      {homeChannelIds
        ?.map(channelId => channelsObj[channelId])
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
          onClick={handleLoadMoreChannels}
          style={{
            width: '100%',
            borderRadius: 0,
            border: 0
          }}
        />
      )}
    </ErrorBoundary>
  );

  async function handleLoadMoreChannels() {
    if (!loading.current) {
      setChannelsLoading(true);
      loading.current = true;
      const data = await loadMoreChannels({
        shownIds: homeChannelIds
      });
      onLoadMoreChannels(data);
      setChannelsLoading(false);
      loading.current = false;
    }
  }
}

export default memo(Channels);
