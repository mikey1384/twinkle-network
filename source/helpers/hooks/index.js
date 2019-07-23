import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';
import { stringIsEmpty } from '../stringHelpers';
export { default as useContentObj } from './useContentObj';
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
      await onSearch(text);
      setSearching(false);
    }, 500);
  }

  return { handleSearch, searching, searchText, setSearchText };
}
