import { useEffect } from 'react';
import { addEvent, removeEvent } from './listenerHelpers';

export function useOutsideClick(ref, callback) {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback();
    };
    addEvent(document, 'mouseup', listener);
    addEvent(document, 'touchend', listener);
    return () => {
      removeEvent(document, 'mouseup', listener);
      removeEvent(document, 'touchend', listener);
    };
  });
}
