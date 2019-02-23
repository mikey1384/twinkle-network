import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from './listenerHelpers';

export function useInfiniteScroll({
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

export function useInterval(callback, interval, tracked) {
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(callback, 1000);
    return function cleanUp() {
      clearInterval(timerRef.current);
    };
  }, tracked);
}

export function useOutsideClick(ref, callback) {
  const [insideClicked, setInsideClicked] = useState(false);
  useEffect(() => {
    function uPlistener(event) {
      if (insideClicked) return setInsideClicked(false);
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback();
    }
    function downListener(event) {
      if (ref.current?.contains(event.target)) {
        setInsideClicked(true);
      }
    }
    addEvent(document, 'mousedown', downListener);
    addEvent(document, 'mouseup', uPlistener);
    addEvent(document, 'touchend', uPlistener);
    return function cleanUp() {
      removeEvent(document, 'mousedown', downListener);
      removeEvent(document, 'mouseup', uPlistener);
      removeEvent(document, 'touchend', uPlistener);
    };
  });
}
