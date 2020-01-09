import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatInfo from './ChatInfo';
import { css } from 'emotion';
import { Color, phoneMaxWidth } from 'constants/css';
import { useChatContext } from 'contexts';

RightMenu.propTypes = {
  channelName: PropTypes.string,
  currentChannel: PropTypes.object,
  currentChannelOnlineMembers: PropTypes.array
};

export default function RightMenu({
  channelName,
  currentChannel,
  currentChannelOnlineMembers
}) {
  const {
    state: { chatType }
  } = useChatContext();
  const MenuRef = useRef(null);
  useEffect(() => {
    MenuRef.current.scrollTop = 0;
  }, [currentChannel.id]);

  return (
    <div
      ref={MenuRef}
      className={css`
        width: 20vw;
        position: relative;
        background: #fff;
        border-left: 1px solid ${Color.borderGray()};
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${phoneMaxWidth}) {
          width: 45vw;
        }
      `}
    >
      {chatType === 'dictionary' && <div>VocabMenu</div>}
      {!chatType && (
        <ChatInfo
          channelName={channelName}
          currentChannel={currentChannel}
          currentChannelOnlineMembers={currentChannelOnlineMembers}
        />
      )}
    </div>
  );
}
