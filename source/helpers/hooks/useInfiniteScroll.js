import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';

export default function useInfiniteScroll({
  scrollable,
  loadable,
  loading,
  onLoad,
  onScrollToBottom
}) {
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  const [scrollHeight, setScrollHeight] = useState(0);
  const scrollPositionRef = useRef({ desktop: 0, mobile: 0 });

  useEffect(() => {
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);

    return function cleanUp() {
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
  }, [scrollHeight]);

  useEffect(() => {
    if (loading) {
      onLoad();
    }
  }, [loading]);

  function onScroll() {
    if (
      document.getElementById('App').scrollHeight > scrollHeight ||
      BodyRef.current.scrollTop > scrollHeight
    ) {
      setScrollHeight(
        Math.max(
          document.getElementById('App').scrollHeight,
          BodyRef.current.scrollTop
        )
      );
    }
    if (scrollable && scrollHeight !== 0) {
      scrollPositionRef.current = {
        desktop: document.getElementById('App').scrollTop,
        mobile: BodyRef.current.scrollTop
      };
      if (
        loadable &&
        (scrollPositionRef.current.desktop >=
          scrollHeight - window.innerHeight - 1000 ||
          scrollPositionRef.current.mobile >=
            scrollHeight - window.innerHeight - 1000)
      ) {
        onScrollToBottom();
      }
    }
  }
  return [setScrollHeight];
}
