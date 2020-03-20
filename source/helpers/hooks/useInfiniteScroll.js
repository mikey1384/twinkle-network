import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';

export default function useInfiniteScroll({
  feedsLength,
  scrollable,
  loadable,
  loading,
  onLoad,
  onScrollToBottom
}) {
  const mounted = useRef(true);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  const prevFeedsLength = useRef(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const scrollPositionRef = useRef({ desktop: 0, mobile: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);

    return function cleanUp() {
      mounted.current = false;
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollable]);

  useEffect(() => {
    if (feedsLength < prevFeedsLength.current) {
      setScrollHeight(
        Math.max(
          document.getElementById('App').scrollHeight,
          BodyRef.current.scrollTop
        )
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
        (document.getElementById('App').scrollHeight > scrollHeight ||
          BodyRef.current.scrollTop > scrollHeight) &&
        mounted.current
      ) {
        setScrollHeight(
          Math.max(
            document.getElementById('App').scrollHeight,
            BodyRef.current.scrollTop
          )
        );
      }
      if (scrollable && document.getElementById('App').scrollHeight !== 0) {
        scrollPositionRef.current = {
          desktop: document.getElementById('App').scrollTop,
          mobile: BodyRef.current.scrollTop
        };
        if (
          loadable &&
          (scrollPositionRef.current.desktop >=
            scrollHeight - window.innerHeight - 1500 ||
            scrollPositionRef.current.mobile >=
              scrollHeight - window.innerHeight - 1500)
        ) {
          onScrollToBottom();
        }
      }
    }, 100);
  }
  return { setScrollHeight, scrollHeight };
}
