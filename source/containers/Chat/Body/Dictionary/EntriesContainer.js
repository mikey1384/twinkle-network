import React from 'react';
import PropTypes from 'prop-types';
import Entry from './Entry';
import { useChatContext } from 'contexts';

EntriesContainer.propTypes = {
  style: PropTypes.object
};

export default function EntriesContainer({ style }) {
  const {
    state: { dictionaryEntries }
  } = useChatContext();

  return (
    <div style={{ padding: '0 1rem 1rem 1rem', ...style }}>
      {dictionaryEntries.map((entry, index) => (
        <Entry
          key={entry.id}
          entry={entry}
          style={{ marginTop: index === 0 ? 0 : '1rem' }}
        />
      ))}
    </div>
  );
}
