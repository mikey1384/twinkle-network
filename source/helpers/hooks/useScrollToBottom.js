import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';

export default function useScrollToBottom(containerRef, threshold = 0) {
  const mounted = useRef(true);
  const timerRef = useRef(null);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollTop, setScrollTop] = useState(
    document.getElementById('App').scrollTop
  );

  useEffect(() => {
    mounted.current = true;
    if (containerRef.current.clientHeight - scrollTop < window.innerHeight) {
      setAtBottom(true);
    }
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);

    function onScroll() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (
          containerRef.current.clientHeight -
            document.getElementById('App').scrollTop <
          window.innerHeight + threshold
        ) {
          setAtBottom(true);
        } else {
          setAtBottom(false);
        }
        setScrollTop(document.getElementById('App').scrollTop);
      }, 50);
    }
    return function cleanUp() {
      mounted.current = false;
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { atBottom, scrollTop };
}
