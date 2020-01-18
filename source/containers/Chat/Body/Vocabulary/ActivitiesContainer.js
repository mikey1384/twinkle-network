import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Activity from './Activity';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

ActivitiesContainer.propTypes = {
  style: PropTypes.object
};

function ActivitiesContainer({ style }) {
  const [scrollAtBottom, setScrollAtBottom] = useState(false);
  const ActivitiesContainerRef = useRef(null);
  const ContentRef = useRef(null);
  const { userId } = useMyState();
  useEffect(() => {
    handleSetScrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    state: { vocabActivities, wordsObj }
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
        {vocabActivities.map((vocab, index) => {
          const word = wordsObj[vocab] || {};
          return (
            <Activity
              key={word.id}
              activity={word}
              setScrollToBottom={handleSetScrollToBottom}
              isLastActivity={index === vocabActivities.length - 1}
              myId={userId}
            />
          );
        })}
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

export default memo(ActivitiesContainer);
