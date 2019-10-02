import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteScroll, useScrollPosition } from 'helpers/hooks';
import PropTypes from 'prop-types';
import InputPanel from './InputPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import Banner from 'components/Banner';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import HomeFilter from './HomeFilter';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';
import { queryStringForArray } from 'helpers/stringHelpers';
import { socket } from 'constants/io';
import { useAppContext } from 'contexts';

Stories.propTypes = {
  location: PropTypes.object.isRequired
};

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

export default function Stories({ location }) {
  const {
    home: {
      state: { category, feeds, loadMoreButton, loaded, subFilter },
      actions: {
        onChangeCategory,
        onChangeSubFilter,
        onDeleteFeed,
        onLoadFeeds,
        onLoadMoreFeeds,
        onLoadNewFeeds
      }
    },
    content: {
      state,
      actions: {
        onAddTags,
        onAddTagToContents,
        onAttachStar,
        onChangeSpoilerStatus,
        onDeleteComment,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onInitContent,
        onLikeContent,
        onLoadComments,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadRepliesOfReply,
        onLoadTags,
        onSetByUserStatus,
        onSetCommentsShown,
        onSetRewardLevel,
        onShowTCReplyInput,
        onUploadTargetComment,
        onUploadComment,
        onUploadReply
      }
    },
    notification: {
      state: { numNewPosts },
      actions: { onResetNumNewPosts }
    },
    user: {
      state: { hideWatched, profileTheme, userId, username }
    },
    view: {
      state: { scrollPositions },
      actions: { onRecordScrollPosition }
    },
    requestHelpers: { loadFeeds, loadNewFeeds }
  } = useAppContext();
  const [displayOrder, setDisplayOrder] = useState('desc');
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFeeds, setLoadingNewFeeds] = useState(false);
  const [feedsOutdated, setFeedsOutdated] = useState(false);
  const [backToTopShown, setBackToTopShown] = useState(false);
  const mounted = useRef(true);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  const categoryRef = useRef(null);
  const ContainerRef = useRef(null);
  const timeOutRef = useRef(null);

  useScrollPosition({
    scrollPositions,
    pathname: location.pathname,
    onRecordScrollPosition: event => {
      setBackToTopShown(false);
      clearTimeout(timeOutRef.current);
      onRecordScrollPosition(event);
    },
    currentSection: `/`
  });

  const [setScrollHeight] = useInfiniteScroll({
    scrollable: feeds.length > 0,
    feedsLength: feeds.length,
    loadable: loadMoreButton,
    loading: loadingMore,
    onScrollToBottom: () => setLoadingMore(true),
    onLoad: loadMoreFeeds
  });

  useEffect(() => {
    if (!loadingMore) {
      timeOutRef.current = setTimeout(
        () =>
          setBackToTopShown(scrollPositions['/'] && scrollPositions['/'] !== 0),
        200
      );
    }
  }, [scrollPositions['/']]);

  useEffect(() => {
    mounted.current = true;
    socket.on('connect', onConnect);
    async function onConnect() {
      const firstFeed = feeds[0];
      if (
        firstFeed?.lastInteraction &&
        !loadingFeeds &&
        category === 'uploads' &&
        subFilter === 'all'
      ) {
        const outdated = await loadNewFeeds({
          lastInteraction: feeds[0] ? feeds[0].lastInteraction : 0,
          shownFeeds: queryStringForArray({
            array: feeds,
            originVar: 'feedId',
            destinationVar: 'shownFeeds'
          })
        });
        if (mounted.current) {
          setFeedsOutdated(outdated.length > 0);
        }
      }
    }
    return function cleanUp() {
      socket.removeListener('connect', onConnect);
      mounted.current = false;
    };
  });

  useEffect(() => {
    if (feeds.length === 0) {
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
  }, []);

  useEffect(() => {
    if (category === 'videos') {
      filterVideos();
    }
    async function filterVideos() {
      const { data } = await loadFeeds({
        order: 'desc',
        filter: categoryObj.videos.filter,
        orderBy: categoryObj.videos.orderBy
      });
      if (category === 'videos') {
        onLoadFeeds(data);
      }
    }
  }, [hideWatched]);

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
              {numNewPosts > 0 && (
                <Banner
                  color="gold"
                  onClick={handleFetchNewFeeds}
                  style={{ marginBottom: '1rem' }}
                >
                  Tap to See {numNewPosts} new Post
                  {numNewPosts > 1 ? 's' : ''}
                </Banner>
              )}
              {feeds.map((feed, index) => {
                const contentKey = feed.contentType + feed.contentId;
                const contentState = state[contentKey] || {
                  contentId: feed.contentId,
                  contentType: feed.contentType
                };
                return (
                  <ContentPanel
                    key={category + subFilter + feed.feedId}
                    style={{
                      marginBottom: '1rem',
                      zIndex: feeds.length - index
                    }}
                    commentsLoadLimit={5}
                    contentObj={contentState}
                    inputAtBottom={feed?.contentType === 'comment'}
                    onInitContent={onInitContent}
                    onAddTags={onAddTags}
                    onAddTagToContents={onAddTagToContents}
                    onAttachStar={onAttachStar}
                    onByUserStatusChange={onSetByUserStatus}
                    onChangeSpoilerStatus={onChangeSpoilerStatus}
                    onCommentSubmit={onUploadComment}
                    onDeleteComment={onDeleteComment}
                    onDeleteContent={onDeleteFeed}
                    onEditComment={onEditComment}
                    onEditContent={onEditContent}
                    onEditRewardComment={onEditRewardComment}
                    onLikeContent={onLikeContent}
                    onLoadMoreComments={onLoadMoreComments}
                    onLoadMoreReplies={onLoadMoreReplies}
                    onLoadRepliesOfReply={onLoadRepliesOfReply}
                    onLoadTags={onLoadTags}
                    onReplySubmit={onUploadReply}
                    onSetCommentsShown={onSetCommentsShown}
                    onSetRewardLevel={onSetRewardLevel}
                    onShowTCReplyInput={onShowTCReplyInput}
                    onLoadComments={onLoadComments}
                    onUploadTargetComment={onUploadTargetComment}
                    userId={userId}
                  />
                );
              })}
              {loadMoreButton && (
                <LoadMoreButton
                  style={{ marginBottom: '1rem' }}
                  onClick={() => setLoadingMore(true)}
                  loading={loadingMore}
                  color="lightBlue"
                  filled
                />
              )}
            </>
          )}
        </div>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          zIndex: 1000,
          width: '100%',
          left: 0,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          onClick={() => {
            document.getElementById('App').scrollTop = 0;
            BodyRef.current.scrollTop = 0;
          }}
          className={css`
            transition: background 0.2s, visibility 0s, opacity 0.3s;
            color: #fff;
            background: ${Color[profileTheme](0.4)};
            visibility: ${backToTopShown ? 'visible' : 'hidden'};
            opacity: ${backToTopShown ? 1 : 0};
            border-radius: ${borderRadius};
            padding: 0.5rem 2rem;
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
            &:hover {
              background: ${Color[profileTheme](0.9)};
            }
          `}
        >
          Back to Top
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
    if (filter === newFilter && categoryRef.current === 'uploads') {
      onLoadFeeds(data);
      setDisplayOrder('desc');
      setScrollHeight(0);
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
      onLoadMoreFeeds(data);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
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
    if (
      loadedFilter === categoryObj[categoryRef.current].filter &&
      categoryRef.current === newCategory
    ) {
      onLoadFeeds(data);
      setDisplayOrder('desc');
      setScrollHeight(0);
      setLoadingFeeds(false);
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
        categoryRef.current === 'uploads'
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
      if (data) onLoadNewFeeds(data);
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
    if (filter === initialFilter) {
      onLoadFeeds(data);
      setDisplayOrder(newDisplayOrder);
      setScrollHeight(0);
      setLoadingFeeds(false);
    }
  }
}
