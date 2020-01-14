import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Activity from './Activity';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

EntriesContainer.propTypes = {
  style: PropTypes.object
};

export default function EntriesContainer({ style }) {
  const [scrollAtBottom, setScrollAtBottom] = useState(false);
  const ActivitiesContainerRef = useRef(null);
  const ContentRef = useRef(null);
  const { userId } = useMyState();
  useEffect(() => {
    handleSetScrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    state: { dictionaryEntries }
  } = useChatContext();

  const fillerHeight = useMemo(
    () =>
      ActivitiesContainerRef.current?.offsetHeight >
      ContentRef.current?.offsetHeight
        ? ActivitiesContainerRef.current?.offsetHeight -
          ContentRef.current?.offsetHeight
        : 20,
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ActivitiesContainerRef.current?.offsetHeight,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ContentRef.current?.offsetHeight
    ]
  );

  console.log(scrollAtBottom);

  return (
    <div ref={ActivitiesContainerRef} style={{ paddingLeft: '1rem', ...style }}>
      <div
        style={{
          height: fillerHeight + 'px'
        }}
      />
      <div ref={ContentRef}>
        {dictionaryEntries.map((entry, index) => (
          <Activity
            key={entry.id}
            activity={entry}
            setScrollToBottom={handleSetScrollToBottom}
            isLastActivity={index === dictionaryEntries.length - 1}
            myId={userId}
          />
        ))}
      </div>
    </div>
  );

  function handleSetScrollToBottom() {
    ActivitiesContainerRef.current.scrollTop =
      ContentRef.current?.offsetHeight || 0;
    setTimeout(
      () =>
        (ActivitiesContainerRef.current.scrollTop =
          ContentRef.current?.offsetHeight || 0),
      100
    );
    if (ContentRef.current?.offsetHeight) setScrollAtBottom(true);
  }
}
