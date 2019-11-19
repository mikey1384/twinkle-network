import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Context from '../Context';
import FilterBar from 'components/FilterBar';
import Icon from 'components/Icon';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';

LeftMenu.propTypes = {
  channels: PropTypes.array.isRequired,
  channelLoadMoreButtonShown: PropTypes.bool.isRequired,
  currentChannel: PropTypes.object.isRequired,
  currentChannelOnlineMembers: PropTypes.array.isRequired,
  loadMoreChannels: PropTypes.func.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired,
  showUserListModal: PropTypes.func.isRequired
};

export default function LeftMenu({
  channels,
  channelLoadMoreButtonShown,
  currentChannel,
  currentChannelOnlineMembers,
  loadMoreChannels,
  onChannelEnter,
  onNewButtonClick
}) {
  const { userId, profileTheme } = useMyState();
  const { selectedChannelId } = useContext(Context);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [prevChannels, setPrevChannels] = useState(channels);
  const [channelName, setChannelName] = useState('');
  const ChannelListRef = useRef(null);
  const loading = useRef(false);
  const channelsObj = useRef({});

  useEffect(() => {
    channelsObj.current = channels.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr
      }),
      {}
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
      selectedChannelId === channels[0].id &&
      channels[0].id !== prevChannels[0].id
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannels(channels);
  }, [channels]);

  useEffect(() => {
    const members = currentChannel?.members || [];
    let otherMember;
    if (currentChannel.twoPeople) {
      otherMember = members.filter(member => Number(member.id) !== userId)[0];
    }
    setChannelName(
      otherMember?.username ||
        channelsObj.current?.[selectedChannelId]?.channelName
    );
  }, [currentChannel]);

  return useMemo(
    () => (
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
            width: 25%;
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
        <FilterBar
          style={{
            fontSize: '1.6rem',
            height: '5rem'
          }}
        >
          <nav className="active" onClick={() => console.log('left click')}>
            Home
          </nav>
          <nav onClick={() => console.log('right click')}>Create</nav>
        </FilterBar>
        <ChatSearchBox />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '15.5rem',
            left: 0,
            right: 0,
            bottom: 0
          }}
          ref={ChannelListRef}
        >
          <div
            style={{
              width: '5rem',
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
              alignItems: 'center',
              fontSize: '2.5rem'
            }}
          >
            <div>
              <Icon icon="comments" />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Icon icon="chalkboard-teacher" />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Icon icon="book" />
            </div>
          </div>
          <div style={{ width: '100%', overflow: 'scroll' }}>
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
    ),
    [
      channels,
      channelLoadMoreButtonShown,
      currentChannel,
      currentChannelOnlineMembers,
      userId,
      selectedChannelId,
      channelsLoading,
      channelName
    ]
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
