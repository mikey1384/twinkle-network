import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Context from '../Context';
import Icon from 'components/Icon';
import {
  Color,
  desktopMinWidth,
  mobileMaxWidth,
  phoneMaxWidth
} from 'constants/css';
import { css } from 'emotion';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

LeftMenu.propTypes = {
  channelLoadMoreButtonShown: PropTypes.bool.isRequired,
  currentChannel: PropTypes.object.isRequired,
  loadMoreChannels: PropTypes.func.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired
};

export default function LeftMenu({
  channelLoadMoreButtonShown,
  currentChannel,
  loadMoreChannels,
  onChannelEnter,
  onNewButtonClick
}) {
  const {
    requestHelpers: { enterDictionary }
  } = useAppContext();
  const {
    state: { chatType, channelIds },
    actions: { onEnterDictionary }
  } = useChatContext();
  const { userId, profileTheme } = useMyState();
  const { selectedChannelId } = useContext(Context);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [prevChannelIds, setPrevChannelIds] = useState(channelIds);
  const ChannelListRef = useRef(null);
  const loading = useRef(false);

  useEffect(() => {
    const ChannelList = ChannelListRef.current;
    addEvent(ChannelList, 'scroll', onListScroll);

    function onListScroll() {
      if (
        channelLoadMoreButtonShown &&
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
      selectedChannelId === channelIds &&
      channelIds[0] !== prevChannelIds[0]
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannelIds(channelIds);
  }, [
    channelLoadMoreButtonShown,
    channelIds,
    selectedChannelId,
    prevChannelIds
  ]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 20vw;
        position: relative;
        background: #fff;
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${phoneMaxWidth}) {
          width: 30vw;
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
          @media (max-width: ${mobileMaxWidth}) {
            background: ${Color[profileTheme](1)};
          }
          @media (min-width: ${desktopMinWidth}) {
            &:hover {
              background: ${Color[profileTheme]()};
            }
          }
        `}
        onClick={onNewButtonClick}
      >
        + New Channel
      </div>
      <div
        style={{
          cursor: 'pointer',
          padding: '1rem',
          borderBottom: `1px solid ${Color.borderGray()}`,
          background: chatType === 'dictionary' && Color.highlightGray()
        }}
        className={`unselectable ${css`
          &:hover {
            background: ${Color.checkboxAreaGray()};
          }
        `}`}
        onClick={handleEnterDictionary}
      >
        <div>
          <div style={{ fontSize: '1.7rem' }}>
            <Icon icon="book" />
            <span style={{ fontWeight: 'bold', marginLeft: '0.7rem' }}>
              Dictionary
            </span>
          </div>
          <p
            style={{
              marginTop: '0.3rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            mikey: Impecunious - not having enough money to pay for necessities
          </p>
        </div>
      </div>
      <ChatSearchBox
        style={{ marginTop: '1rem', padding: '0 1rem', zIndex: 5 }}
      />
      <div
        style={{
          overflow: 'scroll',
          position: 'absolute',
          top: '17.5rem',
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

  async function handleEnterDictionary() {
    await enterDictionary();
    onEnterDictionary();
  }

  async function handleLoadMoreChannels() {
    if (!loading.current) {
      setChannelsLoading(true);
      loading.current = true;
      await loadMoreChannels({
        shownIds: channelIds
      });
      setChannelsLoading(false);
      loading.current = false;
    }
  }
}
