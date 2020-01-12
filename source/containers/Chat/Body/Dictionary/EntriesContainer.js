import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Entry from './Entry';
import { useChatContext } from 'contexts';

EntriesContainer.propTypes = {
  style: PropTypes.object
};

export default function EntriesContainer({ style }) {
  const entriesContainerRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      entriesContainerRef.current.scrollTop = 0;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    state: { dictionaryEntries }
  } = useChatContext();

  return (
    <div
      ref={entriesContainerRef}
      style={{ padding: '0 1rem 5rem 1rem', ...style }}
    >
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
