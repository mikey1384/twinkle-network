import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';

export default function useScrollToBottom(ContainerRef) {
  const mounted = useRef(true);
  const timerRef = useRef(null);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollTop, setScrollTop] = useState(
    document.getElementById('App').scrollTop
  );

  useEffect(() => {
    mounted.current = true;
    if (ContainerRef.current.clientHeight - scrollTop < window.innerHeight) {
      setAtBottom(true);
    }
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);

    function onScroll() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (
          ContainerRef.current.clientHeight -
            document.getElementById('App').scrollTop <
          window.innerHeight
        ) {
          setAtBottom(true);
        } else {
          setAtBottom(false);
        }
        setScrollTop(document.getElementById('App').scrollTop);
      }, 100);
    }
    return function cleanUp() {
      mounted.current = false;
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
  }, []);

  return { atBottom, scrollTop };
}
