import React, { memo } from 'react';
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
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

LeftMenu.propTypes = {
  onChannelEnter: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired
};

function LeftMenu({ onChannelEnter, onNewButtonClick }) {
  const {
    requestHelpers: { loadVocabulary }
  } = useAppContext();
  const {
    state: { chatType },
    actions: { onLoadVocabulary, onSetLoadingVocabulary }
  } = useChatContext();
  const { profileTheme } = useMyState();

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
      <div style={{ width: '100%', position: 'relative', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <Tabs />
            <Channels onChannelEnter={onChannelEnter} />
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
}

export default memo(LeftMenu);
