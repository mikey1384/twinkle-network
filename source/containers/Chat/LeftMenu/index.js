import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import FullTextReveal from 'components/Texts/FullTextReveal';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Context from '../Context';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { textIsOverflown } from 'helpers';
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
  onNewButtonClick,
  showUserListModal
}) {
  const { userId } = useMyState();
  const { selectedChannelId } = useContext(Context);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [onTitleHover, setOnTitleHover] = useState(false);
  const [prevChannels, setPrevChannels] = useState(channels);
  const [channelName, setChannelName] = useState('');
  const ChannelListRef = useRef(null);
  const ChannelTitleRef = useRef(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

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
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          className={css`
            display: flex;
            width: 60%;
            flex-direction: column;
          `}
        >
          <span
            ref={ChannelTitleRef}
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              display: 'flex',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              lineHeight: 'normal',
              cursor: 'default',
              color: !channelName && '#7c7c7c'
            }}
            onClick={() =>
              setOnTitleHover(
                textIsOverflown(ChannelTitleRef.current) ? !onTitleHover : false
              )
            }
            onMouseOver={onMouseOverTitle}
            onMouseLeave={() => setOnTitleHover(false)}
          >
            {channelName || '(Deleted)'}
          </span>
          <FullTextReveal text={channelName || ''} show={onTitleHover} />
          {selectedChannelId !== 0 ? (
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
        <div>
          <Button transparent onClick={onNewButtonClick}>
            + Group
          </Button>
        </div>
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

  function onMouseOverTitle() {
    if (textIsOverflown(ChannelTitleRef.current)) {
      setOnTitleHover(true);
    }
  }

  function renderNumberOfMembers() {
    const numberOfMembers = currentChannel?.members?.length;
    return `${currentChannelOnlineMembers.length || 1}${
      numberOfMembers <= 1 ? '' : '/' + numberOfMembers
    }`;
  }
}
