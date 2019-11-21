import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Context from '../Context';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';

LeftMenu.propTypes = {
  channels: PropTypes.array.isRequired,
  channelLoadMoreButtonShown: PropTypes.bool.isRequired,
  currentChannel: PropTypes.object.isRequired,
  loadMoreChannels: PropTypes.func.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired
};

export default function LeftMenu({
  channels,
  channelLoadMoreButtonShown,
  currentChannel,
  loadMoreChannels,
  onChannelEnter,
  onNewButtonClick
}) {
  const { userId, profileTheme } = useMyState();
  const { selectedChannelId } = useContext(Context);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [prevChannels, setPrevChannels] = useState(channels);
  const ChannelListRef = useRef(null);
  const loading = useRef(false);
  const channelsObj = useRef({});

  useEffect(() => {
    const ChannelList = ChannelListRef.current;
    channelsObj.current = channels.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr
      }),
      {}
    );
    addEvent(ChannelList, 'scroll', onListScroll);

    function onListScroll() {
      if (
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
      selectedChannelId === channels[0].id &&
      channels[0].id !== prevChannels[0].id
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannels(channels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 35rem;
        position: relative;
        background: #fff;
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${mobileMaxWidth}) {
          width: 50vw;
        }
      `}
    >
      <div
        className={css`
          padding: 1rem;
          background: ${Color[profileTheme](0.8)};
          color: #fff;
          display: flex;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          &:hover {
            background: ${Color[profileTheme]()};
          }
        `}
        onClick={onNewButtonClick}
      >
        + Start New Channel
      </div>
      <ChatSearchBox
        style={{ marginTop: '1rem', padding: '0 1rem', zIndex: 5 }}
      />
      <div
        style={{
          overflow: 'scroll',
          position: 'absolute',
          top: '10.5rem',
          left: 0,
          right: 0,
          bottom: 0
        }}
        ref={ChannelListRef}
      >
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ width: '100%' }}>
            <Channels
              userId={userId}
              currentChannel={currentChannel}
              channels={channels}
              selectedChannelId={selectedChannelId}
              onChannelEnter={onChannelEnter}
            />
            {channelLoadMoreButtonShown && (
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
          </div>
        </div>
      </div>
    </div>
  );

  async function handleLoadMoreChannels() {
    if (!loading.current) {
      setChannelsLoading(true);
      loading.current = true;
      await loadMoreChannels({
        currentChannelId: selectedChannelId,
        channelIds: queryStringForArray({
          array: channels,
          originVar: 'id',
          destinationVar: 'channelIds'
        })
      });
      setChannelsLoading(false);
      loading.current = false;
    }
  }
}
