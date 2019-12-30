import React from 'react';
import PropTypes from 'prop-types';
import { useChatContext } from 'contexts';

EntriesContainer.propTypes = {
  style: PropTypes.object
};

export default function EntriesContainer({ style }) {
  const {
    state: { dictionaryEntries }
  } = useChatContext();

  return (
    <div style={style}>
      {dictionaryEntries.map(entry => (
        <div key={entry.id}>{entry.content}</div>
      ))}
    </div>
  );
}
