import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import FullTextReveal from 'components/Texts/FullTextReveal';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { textIsOverflown } from 'helpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

LeftMenu.propTypes = {
  channels: PropTypes.array.isRequired,
  channelLoadMoreButtonShown: PropTypes.bool.isRequired,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.array.isRequired,
  loadMoreChannels: PropTypes.func.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired,
  selectedChannelId: PropTypes.number.isRequired,
  showUserListModal: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};

export default function LeftMenu({
  channels,
  channelLoadMoreButtonShown,
  currentChannel,
  currentChannelOnlineMembers,
  loadMoreChannels,
  onChannelEnter,
  onNewButtonClick,
  selectedChannelId,
  showUserListModal,
  userId
}) {
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [onTitleHover, setOnTitleHover] = useState(false);
  const [channelsObj, setChannelsObj] = useState({});
  const [prevChannels, setPrevChannels] = useState(channels);
  const ChannelListRef = useRef(null);
  const ChannelTitleRef = useRef(null);

  useEffect(() => {
    setChannelsObj(
      channels.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.id]: curr
        }),
        {}
      )
    );
    addEvent(ChannelListRef.current, 'scroll', onListScroll);

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
      removeEvent(ChannelListRef.current, 'scroll', onListScroll);
    };
  });

  useEffect(() => {
    if (
      currentChannel.id === channels[0].id &&
      channels[0].id !== prevChannels[0].id
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannels(channels);
  }, [channels]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 30rem;
        position: relative;
        background: #fff;
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${mobileMaxWidth}) {
          width: 25%;
        }
      `}
    >
      <div
        className={css`
          width: 100%;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
        `}
      >
        <div
          className={css`
            grid-area: channelDetail;
            display: flex;
            width: CALC(100% - 5rem);
            flex-direction: column;
          `}
        >
          <span
            ref={ChannelTitleRef}
            style={{
              gridArea: 'channelName',
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'block',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              lineHeight: 'normal',
              cursor: 'default',
              color: !channelName(currentChannel) && '#7c7c7c'
            }}
            onClick={() =>
              setOnTitleHover(
                textIsOverflown(ChannelTitleRef.current) ? !onTitleHover : false
              )
            }
            onMouseOver={onMouseOverTitle}
            onMouseLeave={() => setOnTitleHover(false)}
          >
            {channelName(currentChannel)
              ? channelName(currentChannel)
              : '(Deleted)'}
          </span>
          <FullTextReveal
            text={channelName(currentChannel) || ''}
            show={onTitleHover}
          />
          {currentChannel.id !== 0 ? (
            <small style={{ gridArea: 'channelMembers', textAlign: 'center' }}>
              <a
                style={{
                  cursor: 'pointer'
                }}
                onClick={showUserListModal}
              >
                {renderNumberOfMembers()}
              </a>{' '}
              online
            </small>
          ) : (
            <small>{'\u00a0'}</small>
          )}
        </div>
        <Button transparent onClick={onNewButtonClick}>
          +New
        </Button>
      </div>
      <ChatSearchBox />
      <div
        style={{
          overflow: 'scroll',
          position: 'absolute',
          top: '11.5rem',
          left: 0,
          right: 0,
          bottom: 0
        }}
        ref={ChannelListRef}
      >
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
  );

  function channelName(currentChannel) {
    return channelsObj[currentChannel.id]?.channelName;
  }

  async function handleLoadMoreChannels() {
    if (!channelsLoading) {
      setChannelsLoading(true);
      await loadMoreChannels(
        currentChannel.id,
        queryStringForArray({
          array: channels,
          originVar: 'id',
          destinationVar: 'channelIds'
        })
      );
      setChannelsLoading(false);
    }
  }

  function onMouseOverTitle() {
    if (textIsOverflown(ChannelTitleRef.current)) {
      setOnTitleHover(true);
    }
  }

  function renderNumberOfMembers() {
    const numberOfMembers = currentChannel.members.length;
    return `${currentChannelOnlineMembers.length || 1}${
      numberOfMembers <= 1 ? '' : '/' + numberOfMembers
    }`;
  }
}
