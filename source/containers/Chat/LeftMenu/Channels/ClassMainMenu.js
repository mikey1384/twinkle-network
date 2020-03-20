import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useChatContext } from 'contexts';
import { Color } from 'constants/css';

ClassMainMenu.propTypes = {
  onChannelEnter: PropTypes.func.isRequired
};

export default function ClassMainMenu({ onChannelEnter }) {
  const {
    state: { classChannelIds, selectedChannelId }
  } = useChatContext();

  const selected = useMemo(() => !classChannelIds.includes(selectedChannelId), [
    classChannelIds,
    selectedChannelId
  ]);

  return (
    <div
      style={{
        width: '100%',
        cursor: 'pointer',
        padding: '1rem',
        height: '6.5rem',
        backgroundColor: selected && Color.highlightGray()
      }}
      onClick={() => {
        if (!selected) {
          onChannelEnter(2);
        }
      }}
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
