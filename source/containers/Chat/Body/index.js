import React from 'react';
import PropTypes from 'prop-types';
import MessagesContainer from './MessagesContainer';
import { phoneMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';

Body.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object,
  loading: PropTypes.bool
};

export default function Body({
  channelName,
  chessOpponent,
  currentChannel,
  loading
}) {
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
      <MessagesContainer
        channelName={channelName}
        chessOpponent={chessOpponent}
        currentChannel={currentChannel}
        loading={loading}
      />
    </div>
  );
}
