import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';
import { stringIsEmpty } from '../stringHelpers';
import { searchUsers } from '../requestHelpers';
export { default as useInfiniteScroll } from './useInfiniteScroll';

export function useInterval(callback, interval, tracked) {
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(callback, interval);
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

export function useSearch({ onSearch, onEmptyQuery, onClear }) {
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const timerRef = useRef(null);

  function handleSearch(text) {
    clearTimeout(timerRef.current);
    setSearchText(text);
    onClear?.();
    if (stringIsEmpty(text)) {
      onEmptyQuery?.();
      return setSearching(false);
    }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      const users = await searchUsers(text);
      onSearch(users);
      setSearching(false);
    }, 500);
  }

  return { handleSearch, searching, searchText, setSearchText };
}

export function useScrollPosition({
  scrollPositions,
  pathname,
  onRecordScrollPosition,
  currentSection
}) {
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useEffect(() => {
    if (currentSection === pathname) {
      setTimeout(() => {
        document.getElementById('App').scrollTop =
          scrollPositions[currentSection] || 0;
        BodyRef.current.scrollTop = scrollPositions[currentSection] || 0;
      }, 0);
    }
  }, [pathname]);
  useEffect(() => {
    addEvent(window, 'scroll', onScroll);
    addEvent(document.getElementById('App'), 'scroll', onScroll);
    function onScroll() {
      const position = Math.max(
        document.getElementById('App').scrollTop,
        BodyRef.current.scrollTop
      );
      onRecordScrollPosition({ section: currentSection, position });
    }
    return function cleanUp() {
      removeEvent(window, 'scroll', onScroll);
      removeEvent(document.getElementById('App'), 'scroll', onScroll);
    };
  });
}
