import React from 'react';
import PropTypes from 'prop-types';
import Entry from './Entry';
import { useChatContext } from 'contexts';

EntriesContainer.propTypes = {
  innerRef: PropTypes.object,
  style: PropTypes.object
};

export default function EntriesContainer({ innerRef, style }) {
  const {
    state: { dictionaryEntries }
  } = useChatContext();

  return (
    <div ref={innerRef} style={{ padding: '0 1rem 5rem 1rem', ...style }}>
      {dictionaryEntries.map((entry, index) => (
        <Entry
          key={entry.id}
          entry={entry}
          style={{ marginTop: index === 0 ? '1rem' : '10rem' }}
        />
      ))}
    </div>
  );
}
