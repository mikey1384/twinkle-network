import { useEffect, useRef } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';

export default function useInfiniteScroll({
  feedsLength,
  scrollable,
  loadable,
  loading,
  onLoad,
  onScrollToBottom
}) {
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  const prevFeedsLength = useRef(0);
  const scrollHeightRef = useRef(0);
  const scrollPositionRef = useRef({ desktop: 0, mobile: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);

    return function cleanUp() {
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
  });

  useEffect(() => {
    if (feedsLength < prevFeedsLength.current) {
      scrollHeightRef.current = Math.max(
        document.getElementById('App').scrollHeight,
        BodyRef.current.scrollTop
      );
    }
    prevFeedsLength.current = feedsLength;
  }, [feedsLength]);

  useEffect(() => {
    if (loading) {
      onLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function onScroll() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (
        document.getElementById('App').scrollHeight > scrollHeightRef.current ||
        BodyRef.current.scrollTop > scrollHeightRef.current
      ) {
        scrollHeightRef.current = Math.max(
          document.getElementById('App').scrollHeight,
          BodyRef.current.scrollTop
        );
      }
      if (scrollable && scrollHeightRef.current !== 0) {
        scrollPositionRef.current = {
          desktop: document.getElementById('App').scrollTop,
          mobile: BodyRef.current.scrollTop
        };
        if (
          loadable &&
          (scrollPositionRef.current.desktop >=
            scrollHeightRef.current - window.innerHeight - 1500 ||
            scrollPositionRef.current.mobile >=
              scrollHeightRef.current - window.innerHeight - 1500)
        ) {
          onScrollToBottom();
        }
      }
    }, 200);
  }
}
