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
  PanelRef,
  inView,
  onSetPlaceholderHeight,
  onSetVisible
}) {
  const timerRef = useRef(null);
  const currentHeight = useRef(null);
  const prevInView = useRef(false);

  useEffect(() => {
    clearTimeout(timerRef.current);
    const clientHeight = PanelRef.current?.clientHeight;
    if (!prevInView.current && inView) {
      if (
        PanelRef.current?.clientHeight &&
        currentHeight.current !== PanelRef.current.clientHeight
      ) {
        onSetPlaceholderHeight(PanelRef.current.clientHeight);
        currentHeight.current = PanelRef.current.clientHeight;
      }
    } else {
      onSetVisible(true);
      timerRef.current = setTimeout(() => {
        onSetVisible(false);
      }, 5000);
    }

    prevInView.current = inView;
    return function onRefresh() {
      if (clientHeight && clientHeight !== currentHeight.current) {
        onSetPlaceholderHeight(clientHeight);
      }
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PanelRef.current?.clientHeight, inView]);
}

export function useMyState() {
  const {
    user: {
      state: {
        hideWatched,
        loaded,
        numWordsCollected,
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
        numWordsCollected,
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      BodyRef.current.scrollTop = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}
