import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useChatContext } from 'contexts';

EntriesContainer.propTypes = {
  style: PropTypes.object
};

export default function EntriesContainer({ style }) {
  const activitiesContainerRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      activitiesContainerRef.current.scrollTop = 0;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    state: { dictionaryEntries }
  } = useChatContext();

  return (
    <div
      ref={activitiesContainerRef}
      style={{ padding: '0 1rem 5rem 1rem', ...style }}
    >
      {dictionaryEntries.map((entry, index) => (
        <div
          key={entry.id}
          style={{ marginTop: index === 0 ? '1rem' : '10rem' }}
        />
      ))}
    </div>
  );
}
