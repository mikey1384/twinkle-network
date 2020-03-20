import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import MessagesContainer from './MessagesContainer';
import Vocabulary from './Vocabulary';
import Loading from 'components/Loading';
import { phoneMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';
import { useChatContext } from 'contexts';

Body.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object
};

function Body({ channelName, chessOpponent, currentChannel }) {
  const {
    state: {
      chatType,
      loadingVocabulary,
      selectedChatTab,
      selectedChannelId,
      channelsObj
    }
  } = useChatContext();
  const isViewingAboutClassPage = useMemo(
    () =>
      selectedChatTab === 'class' && !channelsObj[selectedChannelId].isClass,
    [channelsObj, selectedChannelId, selectedChatTab]
  );

  return (
    <div
      className={css`
        height: 100%;
        width: ${isViewingAboutClassPage ? '80vw' : '60vw'};
        border-left: 1px solid ${Color.borderGray()};
        padding: 0;
        position: relative;
        background: #fff;
        @media (max-width: ${phoneMaxWidth}) {
          width: ${chatType === 'vocabulary'
            ? '77vw'
            : isViewingAboutClassPage
            ? '120vw'
            : '85vw'};
        }
      `}
    >
      {loadingVocabulary ? (
        <Loading text="Loading Vocabulary" />
      ) : (
        <>
          {chatType === 'vocabulary' ? (
            <Vocabulary />
          ) : isViewingAboutClassPage ? (
            <div>Viewing about class</div>
          ) : (
            <MessagesContainer
              channelName={channelName}
              chessOpponent={chessOpponent}
              currentChannel={currentChannel}
            />
          )}
        </>
      )}
    </div>
  );
}

export default memo(Body);
