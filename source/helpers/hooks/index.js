/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { addEvent, removeEvent } from '../listenerHelpers';
import { stringIsEmpty } from '../stringHelpers';
import { useAppContext, useContentContext, useProfileContext } from 'contexts';
export { default as useScrollToBottom } from './useScrollToBottom';
export { default as useInfiniteScroll } from './useInfiniteScroll';

export function useContentState({ contentType, contentId }) {
  const { state } = useContentContext();
  return state[contentType + contentId] || {};
}

export function useInterval(callback, interval) {
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(callback, interval);
    return function cleanUp() {
      clearInterval(timerRef.current);
    };
  }, [callback, interval]);
}

export function useLazyLoad({
  contentType,
  contentId,
  PanelRef,
  inView,
  onSetPlaceholderHeight,
  onSetVisible
}) {
  const prevInView = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!prevInView.current && inView) {
      if (PanelRef.current?.clientHeight) {
        onSetPlaceholderHeight({
          contentType,
          contentId,
          height: PanelRef.current.clientHeight
        });
      }
    }
    if (inView) {
      onSetVisible({
        contentId,
        contentType,
        visible: true
      });
    } else {
      timerRef.current = setTimeout(() => {
        onSetVisible({
          contentId,
          contentType,
          visible: false
        });
      }, 5000);
    }
    prevInView.current = inView;
    return function onRefresh() {
      if (inView) {
        clearTimeout(timerRef.current);
      }
      if (PanelRef.current?.clientHeight) {
        onSetPlaceholderHeight({
          contentType,
          contentId,
          height: PanelRef.current.clientHeight
        });
      }
    };
  }, [inView, PanelRef.current?.clientHeight]);

  useEffect(() => {
    return function cleanUp() {
      onSetVisible({
        contentId,
        contentType,
        visible: false
      });
      clearTimeout(timerRef.current);
    };
  }, []);
}

export function useMyState() {
  const {
    user: {
      state: {
        hideWatched,
        loaded,
        userId,
        searchFilter,
        signinModalShown,
        xpThisMonth
      }
    }
  } = useAppContext();
  const myState = useContentState({
    contentId: userId,
    contentType: 'user'
  });
  return myState.loaded
    ? {
        ...myState,
        loaded,
        userId,
        defaultSearchFilter: searchFilter,
        hideWatched,
        isCreator: myState.userType === 'creator',
        loggedIn: true,
        signinModalShown,
        xpThisMonth
      }
    : { loaded, profileTheme: 'logoBlue', signinModalShown };
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

export function useProfileState(username) {
  const { state = {} } = useProfileContext();
  const { [username]: userState = {} } = state;
  const {
    notExist = false,
    notables = { feeds: [] },
    posts = {
      all: [],
      comments: [],
      likes: [],
      subjects: [],
      videos: [],
      links: []
    },
    profileId
  } = userState;
  return { notables, posts, notExist, profileId };
}

export function useSearch({
  onSearch,
  onEmptyQuery,
  onClear,
  onSetSearchText
}) {
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);

  function handleSearch(text) {
    clearTimeout(timerRef.current);
    onSetSearchText(text);
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

  return { handleSearch, searching };
}

export function useScrollPosition({
  onRecordScrollPosition,
  pathname,
  scrollPositions = {}
}) {
  const BodyRef = useRef(document.scrollingElement || document.documentElement);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('App').scrollTop = scrollPositions[pathname] || 0;
      BodyRef.current.scrollTop = scrollPositions[pathname] || 0;
    }, 0);

    return function recordScrollPositionAndCleanUp() {
      const position = Math.max(
        document.getElementById('App').scrollTop,
        BodyRef.current.scrollTop
      );
      onRecordScrollPosition({ section: pathname, position });
      document.getElementById('App').scrollTop = 0;
      BodyRef.current.scrollTop = 0;
    };
  }, [pathname]);
}
