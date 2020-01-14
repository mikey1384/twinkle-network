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
    state: { vocabActivities, wordsObj }
  } = useChatContext();

  return (
    <div
      ref={entriesContainerRef}
      style={{ padding: '0 1rem 5rem 1rem', ...style }}
    >
      {vocabActivities.map((vocab, index) => {
        const word = wordsObj[vocab] || {};
        return (
          <Entry
            key={word.id}
            entry={word}
            style={{ marginTop: index === 0 ? '1rem' : '10rem' }}
          />
        );
      })}
    </div>
  );
}
