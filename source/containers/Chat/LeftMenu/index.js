import React, { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import Vocabulary from './Vocabulary';
import Icon from 'components/Icon';
import Tabs from './Tabs';
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
  currentChannel: PropTypes.object.isRequired,
  onChannelEnter: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired
};

function LeftMenu({ currentChannel, onChannelEnter, onNewButtonClick }) {
  const {
    requestHelpers: { loadMoreChannels, loadVocabulary }
  } = useAppContext();
  const {
    state: { channelLoadMoreButton, chatType, channelIds, selectedChannelId },
    actions: { onLoadMoreChannels, onLoadVocabulary, onSetLoadingVocabulary }
  } = useChatContext();
  const { profileTheme } = useMyState();
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [prevChannelIds, setPrevChannelIds] = useState(channelIds);
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
      selectedChannelId === channelIds &&
      channelIds[0] !== prevChannelIds[0]
    ) {
      ChannelListRef.current.scrollTop = 0;
    }
    setPrevChannelIds(channelIds);
  }, [channelLoadMoreButton, channelIds, selectedChannelId, prevChannelIds]);

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
          width: 35vw;
        }
      `}
    >
      <div
        className={`unselectable ${css`
          padding: 1rem;
          background: ${Color[profileTheme](0.8)};
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
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
        `}`}
        onClick={onNewButtonClick}
      >
        <Icon icon="plus" />
        <div
          style={{
            marginLeft: '0.7rem'
          }}
        >
          New Chat
        </div>
      </div>
      <Vocabulary
        selected={chatType === 'vocabulary'}
        onClick={handleEnterVocabulary}
      />
      <ChatSearchBox
        style={{
          marginTop: '1rem',
          padding: '0 1rem',
          zIndex: 5,
          width: '100%'
        }}
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
          <Tabs />
          <div style={{ width: '80%' }}>
            <Channels
              channelLoadMoreButton={channelLoadMoreButton}
              currentChannel={currentChannel}
              selectedChannelId={selectedChannelId}
              onChannelEnter={onChannelEnter}
              channelsLoading={channelsLoading}
              onLoadMoreChannels={handleLoadMoreChannels}
            />
          </div>
        </div>
      </div>
    </div>
  );

  async function handleEnterVocabulary() {
    onSetLoadingVocabulary(true);
    const {
      vocabActivities,
      wordsObj,
      wordCollectors
    } = await loadVocabulary();
    onLoadVocabulary({ vocabActivities, wordsObj, wordCollectors });
    onSetLoadingVocabulary(false);
  }

  async function handleLoadMoreChannels() {
    if (!loading.current) {
      setChannelsLoading(true);
      loading.current = true;
      const data = await loadMoreChannels({
        shownIds: channelIds
      });
      onLoadMoreChannels(data);
      setChannelsLoading(false);
      loading.current = false;
    }
  }
}

export default memo(LeftMenu);
