import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import InputPanel from './InputPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import Banner from 'components/Banner';
import ErrorBoundary from 'components/ErrorBoundary';
import HomeFilter from './HomeFilter';
import ContentPanel from 'components/ContentPanel';
import { css } from 'emotion';
import { queryStringForArray } from 'helpers/stringHelpers';
import { mobileMaxWidth } from 'constants/css';
import { socket } from 'constants/io';
import {
  useInfiniteScroll,
  useMyState,
  useScrollPosition
} from 'helpers/hooks';
import {
  useAppContext,
  useHomeContext,
  useViewContext,
  useNotiContext
} from 'contexts';

const categoryObj = {
  uploads: {
    filter: 'all',
    orderBy: 'lastInteraction'
  },
  challenges: {
    filter: 'subject',
    orderBy: 'rewardLevel'
  },
  responses: {
    filter: 'comment',
    orderBy: 'totalStars'
  },
  videos: {
    filter: 'video',
    orderBy: 'totalViewDuration'
  }
};

Stories.propTypes = {
  location: PropTypes.object
};

function Stories({ location }) {
  const {
    requestHelpers: { loadFeeds, loadNewFeeds }
  } = useAppContext();
  const { hideWatched, userId, username } = useMyState();
  const {
    state: { numNewPosts },
    actions: { onResetNumNewPosts }
  } = useNotiContext();
  const {
    state: {
      category,
      displayOrder,
      feeds,
      loadMoreButton,
      loaded,
      feedsOutdated,
      subFilter
    },
    actions: {
      onChangeCategory,
      onChangeSubFilter,
      onLoadFeeds,
      onLoadMoreFeeds,
      onLoadNewFeeds,
      onSetDisplayOrder,
      onSetFeedsOutdated
    }
  } = useHomeContext();

  const {
    actions: { onRecordScrollPosition },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions
  });

  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFeeds, setLoadingNewFeeds] = useState(false);
  const mounted = useRef(true);
  const categoryRef = useRef(null);
  const ContainerRef = useRef(null);
  const hideWatchedRef = useRef(null);
  const disconnected = useRef(false);

  useInfiniteScroll({
    scrollable: feeds.length > 0,
    feedsLength: feeds.length,
    loadable: loadMoreButton,
    loading: loadingMore,
    onScrollToBottom: () => setLoadingMore(true),
    onLoad: loadMoreFeeds
  });

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    async function onConnect() {
      const firstFeed = feeds[0];
      if (
        firstFeed?.lastInteraction &&
        !loadingFeeds &&
        category === 'uploads' &&
        subFilter === 'all'
      ) {
        if (disconnected.current) {
          disconnected.current = false;
          const outdated = await loadNewFeeds({
            lastInteraction: feeds[0] ? feeds[0].lastInteraction : 0,
            shownFeeds: queryStringForArray({
              array: feeds,
              originVar: 'feedId',
              destinationVar: 'shownFeeds'
            })
          });
          if (mounted.current) {
            onSetFeedsOutdated(outdated.length > 0);
          }
        }
      }
    }
    function onDisconnect() {
      disconnected.current = true;
    }
    return function cleanUp() {
      socket.removeListener('connect', onConnect);
      socket.removeListener('disconnect', onDisconnect);
    };
  });

  useEffect(() => {
    if (
      category === 'videos' &&
      loaded &&
      typeof hideWatchedRef.current === 'number' &&
      hideWatchedRef.current !== hideWatched
    ) {
      filterVideos();
    }
    async function filterVideos() {
      const { data } = await loadFeeds({
        order: 'desc',
        filter: categoryObj.videos.filter,
        orderBy: categoryObj.videos.orderBy
      });
      if (category === 'videos' && mounted.current) {
        onLoadFeeds(data);
      }
    }
    hideWatchedRef.current = hideWatched;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideWatched]);

  useEffect(() => {
    if (!loaded) {
      init();
    }
    async function init() {
      setLoadingFeeds(true);
      categoryRef.current = 'uploads';
      onChangeCategory('uploads');
      onChangeSubFilter('all');
      onResetNumNewPosts();
      try {
        const { data } = await loadFeeds();
        onLoadFeeds(data);
        setLoadingFeeds(false);
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const ContentPanels = useMemo(() => {
    return feeds.map((feed, index) => (
      <ContentPanel
        key={category + subFilter + feed.contentId + feed.contentType}
        style={{
          marginBottom: '1rem',
          zIndex: feeds.length - index
        }}
        contentId={feed.contentId}
        contentType={feed.contentType}
        commentsLoadLimit={5}
        numPreviewComments={1}
        userId={userId}
      />
    ));
  }, [category, feeds, subFilter, userId]);

  return (
    <ErrorBoundary>
      <div style={{ width: '100%' }} ref={ContainerRef}>
        <HomeFilter
          category={category}
          changeCategory={handleChangeCategory}
          displayOrder={displayOrder}
          selectedFilter={subFilter}
          applyFilter={applyFilter}
          setDisplayOrder={handleDisplayOrder}
        />
        <InputPanel />
        <div style={{ width: '100%' }}>
          {loadingFeeds && <Loading text="Loading Feeds..." />}
          {loaded && feeds.length === 0 && !loadingFeeds && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '15rem'
              }}
            >
              <h1 style={{ textAlign: 'center' }}>
                {username
                  ? `Hello ${username}, be the first to post something`
                  : 'Hi there!'}
              </h1>
            </div>
          )}
          {loaded && !loadingFeeds && feeds.length > 0 && (
            <>
              {feedsOutdated && (
                <Banner
                  color="gold"
                  onClick={() => window.location.reload()}
                  style={{ marginBottom: '1rem' }}
                >
                  Tap to See New Posts!
                </Banner>
              )}
              {numNewPosts > 0 && !feedsOutdated && (
                <Banner
                  color="gold"
                  onClick={handleFetchNewFeeds}
                  style={{ marginBottom: '1rem' }}
                >
                  Tap to See {numNewPosts} new Post
                  {numNewPosts > 1 ? 's' : ''}
                </Banner>
              )}
              {ContentPanels}
              {loadMoreButton && (
                <LoadMoreButton
                  style={{ marginBottom: '1rem' }}
                  onClick={() => setLoadingMore(true)}
                  loading={loadingMore}
                  color="lightBlue"
                  filled
                />
              )}
              <div
                className={css`
                  display: none;
                  @media (max-width: ${mobileMaxWidth}) {
                    display: block;
                    height: 5rem;
                  }
                `}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  async function applyFilter(filter) {
    if (filter === subFilter) return;
    setLoadingFeeds(true);
    categoryRef.current = 'uploads';
    onChangeCategory('uploads');
    onChangeSubFilter(filter);
    const { data, filter: newFilter } = await loadFeeds({ filter });
    if (
      filter === newFilter &&
      categoryRef.current === 'uploads' &&
      mounted.current
    ) {
      onLoadFeeds(data);
      onSetDisplayOrder('desc');
      setLoadingFeeds(false);
    }
  }

  async function loadMoreFeeds() {
    try {
      const { data } = await loadFeeds({
        filter:
          category === 'uploads' ? subFilter : categoryObj[category].filter,
        order: displayOrder,
        orderBy: categoryObj[category].orderBy,
        shownFeeds: queryStringForArray({
          array: feeds,
          originVar: 'feedId',
          destinationVar: 'shownFeeds'
        })
      });
      if (mounted.current) {
        onLoadMoreFeeds(data);
        setLoadingMore(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingMore(false);
    }
  }

  async function handleChangeCategory(newCategory) {
    categoryRef.current = newCategory;
    setLoadingFeeds(true);
    onChangeCategory(newCategory);
    onChangeSubFilter(categoryObj[newCategory].filter);
    const { filter: loadedFilter, data } = await loadFeeds({
      order: 'desc',
      filter: categoryObj[newCategory].filter,
      orderBy: categoryObj[newCategory].orderBy
    });
    if (mounted.current) {
      if (
        loadedFilter === categoryObj[categoryRef.current].filter &&
        categoryRef.current === newCategory
      ) {
        onLoadFeeds(data);
        onSetDisplayOrder('desc');
        setLoadingFeeds(false);
      }
    }
  }

  async function handleFetchNewFeeds() {
    if (category !== 'uploads' || displayOrder === 'asc') {
      onResetNumNewPosts();
      categoryRef.current = 'uploads';
      onChangeCategory('uploads');
      const { data, filter } = await loadFeeds();
      if (
        filter === categoryObj.uploads.filter &&
        categoryRef.current === 'uploads' &&
        mounted.current
      ) {
        onLoadFeeds(data);
      }
      return;
    }
    if (!loadingNewFeeds) {
      setLoadingNewFeeds(true);
      onResetNumNewPosts();
      const data = await loadNewFeeds({
        lastInteraction: feeds[0] ? feeds[0].lastInteraction : 0,
        shownFeeds: queryStringForArray({
          array: feeds,
          originVar: 'feedId',
          destinationVar: 'shownFeeds'
        })
      });
      if (data && mounted.current) onLoadNewFeeds(data);
      setLoadingNewFeeds(false);
    }
  }

  async function handleDisplayOrder() {
    const newDisplayOrder = displayOrder === 'desc' ? 'asc' : 'desc';
    const initialFilter =
      category === 'uploads' ? subFilter : categoryObj[category].filter;
    setLoadingFeeds(true);
    const { data, filter } = await loadFeeds({
      order: newDisplayOrder,
      orderBy: categoryObj[category].orderBy,
      filter: initialFilter
    });
    if (filter === initialFilter && mounted.current) {
      onLoadFeeds(data);
      onSetDisplayOrder(newDisplayOrder);
      setLoadingFeeds(false);
    }
  }
}

export default memo(Stories);
