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
  currentChannel: PropTypes.object,
  currentChannelOnlineMembers: PropTypes.array
};

export default function RightMenu({
  channelName,
  currentChannel,
  currentChannelOnlineMembers
}) {
  const {
    requestHelpers: { loadRankings }
  } = useAppContext();
  const { userId, twinkleXP } = useMyState();
  const {
    state: { chatType }
  } = useChatContext();
  const {
    state: { allRanks },
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
          width: 45vw;
        }
      `}
    >
      {chatType === 'dictionary' && <VocabInfo rankings={allRanks} />}
      {!chatType && (
        <ChatInfo
          channelName={channelName}
          currentChannel={currentChannel}
          currentChannelOnlineMembers={currentChannelOnlineMembers}
        />
      )}
    </div>
  );

  async function handleLoadRankings() {
    const { all, top30s } = await loadRankings();
    onGetRanks({ all, top30s });
  }
}
