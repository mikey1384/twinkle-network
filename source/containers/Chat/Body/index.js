import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MessagesContainer from './MessagesContainer';
import Vocabulary from './Vocabulary';
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
    state: { chatType }
  } = useChatContext();

  return (
    <div
      className={css`
        height: 100%;
        width: 60vw;
        border-left: 1px solid ${Color.borderGray()};
        padding: 0;
        position: relative;
        background: #fff;
        @media (max-width: ${phoneMaxWidth}) {
          width: 77vw;
        }
      `}
    >
      {chatType === 'vocabulary' && <Vocabulary />}
      {!chatType && (
        <MessagesContainer
          channelName={channelName}
          chessOpponent={chessOpponent}
          currentChannel={currentChannel}
        />
      )}
    </div>
  );
}

export default memo(Body);
