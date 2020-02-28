import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatInfo from './ChatInfo';
import VocabInfo from './VocabInfo';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { Color, phoneMaxWidth } from 'constants/css';
import { useAppContext, useChatContext, useNotiContext } from 'contexts';

RightMenu.propTypes = {
  channelName: PropTypes.string,
  channelOnCall: PropTypes.number,
  currentChannel: PropTypes.object,
  currentChannelOnlineMembers: PropTypes.array,
  selectedChannelId: PropTypes.number
};

export default function RightMenu({
  channelName,
  channelOnCall,
  currentChannel,
  currentChannelOnlineMembers,
  selectedChannelId
}) {
  const {
    requestHelpers: { loadRankings }
  } = useAppContext();
  const { userId, twinkleXP } = useMyState();
  const {
    state: { chatType }
  } = useChatContext();
  const {
    actions: { onGetRanks }
  } = useNotiContext();
  const MenuRef = useRef(null);
  const prevTwinkleXP = useRef(twinkleXP);

  useEffect(() => {
    MenuRef.current.scrollTop = 0;
  }, [currentChannel.id]);

  useEffect(() => {
    handleLoadRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (
      typeof twinkleXP === 'number' &&
      twinkleXP > (prevTwinkleXP.current || 0)
    ) {
      handleLoadRankings();
    }
    prevTwinkleXP.current = twinkleXP;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twinkleXP]);

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
          width: ${chatType === 'vocabulary' ? '45vw' : '37vw'};
        }
      `}
    >
      {chatType === 'vocabulary' && <VocabInfo />}
      {!chatType && (
        <ChatInfo
          channelName={channelName}
          channelOnCall={channelOnCall}
          currentChannel={currentChannel}
          currentChannelOnlineMembers={currentChannelOnlineMembers}
          selectedChannelId={selectedChannelId}
        />
      )}
    </div>
  );

  async function handleLoadRankings() {
    const { all, top30s } = await loadRankings();
    onGetRanks({ all, top30s });
  }
}
