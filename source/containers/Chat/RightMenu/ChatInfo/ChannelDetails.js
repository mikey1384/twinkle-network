import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FullTextReveal from 'components/Texts/FullTextReveal';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { useChatContext } from 'contexts';
import { isMobile, textIsOverflown } from 'helpers';
import { useMyState } from 'helpers/hooks';

ChannelDetails.propTypes = {
  channelId: PropTypes.number,
  channelName: PropTypes.string,
  style: PropTypes.object
};

export default function ChannelDetails({ channelId, channelName, style }) {
  const {
    state: { customChannelNames }
  } = useChatContext();
  const { profileTheme } = useMyState();
  const [channelNameHovered, setChannelNameHovered] = useState(false);
  const ChannelNameRef = useRef(null);
  console.log(channelId);
  return (
    <div
      onClick={() => setChannelNameHovered(hovered => !hovered)}
      style={style}
      className={css`
        width: 100%;
        line-height: 1.5;
        padding: 0 1rem 0 1rem;
        font-size: 2.5rem;
        font-weight: bold;
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 1.7rem;
        }
      `}
    >
      <p
        ref={ChannelNameRef}
        style={{
          width: '100%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          cursor: 'default',
          color:
            channelId === 2
              ? Color[
                  profileTheme === 'black'
                    ? 'logoBlue'
                    : profileTheme === 'vantablack'
                    ? 'darkBlue'
                    : profileTheme
                ]()
              : ''
        }}
        onMouseEnter={handleMouseOver}
        onMouseLeave={() => setChannelNameHovered(false)}
      >
        {customChannelNames[channelId] || channelName}
      </p>
      <FullTextReveal
        style={{ width: '100%', fontSize: '1.5rem' }}
        show={channelNameHovered}
        direction="left"
        text={channelName || ''}
      />
    </div>
  );

  function handleMouseOver() {
    if (textIsOverflown(ChannelNameRef.current) && !isMobile(navigator)) {
      setChannelNameHovered(true);
    }
  }
}
