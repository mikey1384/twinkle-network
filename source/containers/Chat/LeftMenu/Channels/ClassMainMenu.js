import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useChatContext } from 'contexts';
import { Color, desktopMinWidth } from 'constants/css';
import { css } from 'emotion';

ClassMainMenu.propTypes = {
  onChannelEnter: PropTypes.func.isRequired
};

export default function ClassMainMenu({ onChannelEnter }) {
  const {
    state: { chatType, classChannelIds, selectedChannelId }
  } = useChatContext();

  const selected = useMemo(
    () =>
      chatType !== 'vocabulary' && !classChannelIds.includes(selectedChannelId),
    [chatType, classChannelIds, selectedChannelId]
  );

  return (
    <div
      className={css`
        @media (min-width: ${desktopMinWidth}) {
          &:hover {
            background: ${Color.checkboxAreaGray()};
          }
        }
      `}
      style={{
        width: '100%',
        cursor: 'pointer',
        padding: '1rem',
        height: '6.5rem',
        backgroundColor: selected && Color.highlightGray()
      }}
      onClick={() => onChannelEnter(2)}
    >
      <p
        style={{
          fontWeight: 'bold'
        }}
      >
        About class groups
      </p>
    </div>
  );
}
