import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteScroll } from 'helpers/hooks';
import PropTypes from 'prop-types';
import {
  addTags,
  addTagToContents,
  attachStar,
  changeByUserStatus,
  changeCategory,
  changeSubFilter,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentEdit,
  feedContentDelete,
  feedRewardCommentEdit,
  fetchMoreFeeds,
  fetchNewFeeds,
  fetchFeeds,
  fetchFeed,
  loadMoreFeedReplies,
  loadMoreFeedComments,
  loadRepliesOfReply,
  loadTags,
  clearFeeds,
  setCurrentSection,
  setDifficulty,
  showFeedComments,
  uploadFeedComment,
  uploadTargetContentComment
} from 'redux/actions/FeedActions';
import { toggleHideWatched } from 'redux/actions/UserActions';
import { resetNumNewPosts } from 'redux/actions/NotiActions';
import InputPanel from './InputPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import { connect } from 'react-redux';
import Banner from 'components/Banner';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { queryStringForArray } from 'helpers/stringHelpers';
import { loadFeeds, loadNewFeeds } from 'helpers/requestHelpers';
import HomeFilter from './HomeFilter';

Stories.propTypes = {
  addTags: PropTypes.func.isRequired,
  addTagToContents: PropTypes.func.isRequired,
  attachStar: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  changeByUserStatus: PropTypes.func.isRequired,
  changeSubFilter: PropTypes.func.isRequired,
  chatMode: PropTypes.bool,
  clearFeeds: PropTypes.func.isRequired,
  contentFeedLike: PropTypes.func.isRequired,
  feedCommentDelete: PropTypes.func.isRequired,
  feedContentDelete: PropTypes.func.isRequired,
  feedContentEdit: PropTypes.func.isRequired,
  feedCommentEdit: PropTypes.func.isRequired,
  feedRewardCommentEdit: PropTypes.func.isRequired,
  fetchFeed: PropTypes.func.isRequired,
  fetchFeeds: PropTypes.func.isRequired,
  fetchMoreFeeds: PropTypes.func.isRequired,
  fetchNewFeeds: PropTypes.func.isRequired,
  hideWatched: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  loadMoreFeedComments: PropTypes.func.isRequired,
  loadMoreFeedReplies: PropTypes.func.isRequired,
  loadRepliesOfReply: PropTypes.func.isRequired,
  loadTags: PropTypes.func.isRequired,
  numNewPosts: PropTypes.number.isRequired,
  resetNumNewPosts: PropTypes.func.isRequired,
  searchMode: PropTypes.bool.isRequired,
  setCurrentSection: PropTypes.func.isRequired,
  setDifficulty: PropTypes.func,
  showFeedComments: PropTypes.func.isRequired,
  storyFeeds: PropTypes.array.isRequired,
  subFilter: PropTypes.string.isRequired,
  toggleHideWatched: PropTypes.func.isRequired,
  username: PropTypes.string,
  uploadFeedComment: PropTypes.func.isRequired,
  uploadTargetContentComment: PropTypes.func.isRequired,
  userId: PropTypes.number
};

const categoryObj = {
  uploads: {
    filter: 'all',
    orderBy: 'lastInteraction'
  },
  challenges: {
    filter: 'post',
    orderBy: 'difficulty'
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

function Stories({
  addTags,
  addTagToContents,
  attachStar,
  category,
  chatMode,
  changeByUserStatus,
  changeCategory,
  changeSubFilter,
  clearFeeds,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedContentEdit,
  feedRewardCommentEdit,
  fetchFeed,
  fetchFeeds,
  fetchMoreFeeds,
  fetchNewFeeds,
  hideWatched,
  history,
  loaded,
  loadMoreFeedComments,
  loadRepliesOfReply,
  loadMoreButton,
  loadMoreFeedReplies,
  loadTags,
  numNewPosts,
  resetNumNewPosts,
  searchMode,
  setCurrentSection,
  setDifficulty,
  showFeedComments,
  storyFeeds = [],
  subFilter,
  toggleHideWatched,
  uploadFeedComment,
  uploadTargetContentComment,
  userId,
  username
}) {
  const [displayOrder, setDisplayOrder] = useState('desc');
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFeeds, setLoadingNewFeeds] = useState(false);
  const categoryRef = useRef(null);
  const ContainerRef = useRef(null);

  const [setScrollHeight] = useInfiniteScroll({
    scrollable: !chatMode && !searchMode && storyFeeds.length > 0,
    loadable: loadMoreButton,
    loading: loadingMore,
    onScrollToBottom: () => setLoadingMore(true),
    onLoad: loadMoreFeeds
  });

  useEffect(() => {
    setCurrentSection('storyFeeds');
    if (history.action === 'PUSH' || !loaded) {
      init();
    }
    async function init() {
      categoryRef.current = 'uploads';
      changeCategory('uploads');
      changeSubFilter('all');
      resetNumNewPosts();
      clearFeeds();
      try {
        const { data } = await loadFeeds();
        fetchFeeds(data);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (category === 'videos') {
      clearFeeds();
      filterVideos();
    }
    async function filterVideos() {
      const { data } = await loadFeeds({
        order: 'desc',
        filter: categoryObj.videos.filter,
        orderBy: categoryObj.videos.orderBy
      });
      if (category === 'videos') {
        fetchFeeds(data);
      }
    }
  }, [hideWatched]);

  return (
    <ErrorBoundary>
      <div ref={ContainerRef}>
        <HomeFilter
          category={category}
          changeCategory={handleChangeCategory}
          displayOrder={displayOrder}
          hideWatched={hideWatched}
          selectedFilter={subFilter}
          applyFilter={applyFilter}
          setDisplayOrder={handleDisplayOrder}
          toggleHideWatched={toggleHideWatched}
          userId={userId}
        />
        <InputPanel />
        <div style={{ width: '100%' }}>
          {!loaded && <Loading text="Loading Feeds..." />}
          {loaded && storyFeeds.length === 0 && (
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
          {loaded && storyFeeds.length > 0 && (
            <>
              {numNewPosts > 0 && (
                <Banner
                  color="gold"
                  onClick={handleFetchNewFeeds}
                  style={{ marginBottom: '1rem' }}
                >
                  Click to See {numNewPosts} new Post
                  {numNewPosts > 1 ? 's' : ''}
                </Banner>
              )}
              {storyFeeds.map((feed, index) => {
                return (
                  <ContentPanel
                    key={feed.feedId}
                    style={{
                      marginBottom: '1rem',
                      zIndex: storyFeeds.length - index
                    }}
                    commentsLoadLimit={5}
                    contentObj={feed}
                    inputAtBottom={feed.type === 'comment'}
                    onInitContent={fetchFeed}
                    onAddTags={addTags}
                    onAddTagToContents={addTagToContents}
                    onAttachStar={attachStar}
                    onByUserStatusChange={changeByUserStatus}
                    onCommentSubmit={data =>
                      handleUploadFeedComment({ feed, data })
                    }
                    onDeleteComment={feedCommentDelete}
                    onDeleteContent={feedContentDelete}
                    onEditComment={feedCommentEdit}
                    onEditContent={feedContentEdit}
                    onEditRewardComment={feedRewardCommentEdit}
                    onLikeContent={contentFeedLike}
                    onLoadMoreComments={loadMoreFeedComments}
                    onLoadMoreReplies={loadMoreFeedReplies}
                    onLoadRepliesOfReply={loadRepliesOfReply}
                    onLoadTags={loadTags}
                    onReplySubmit={data =>
                      handleUploadFeedComment({ feed, data })
                    }
                    onSetDifficulty={setDifficulty}
                    onShowComments={showFeedComments}
                    onTargetCommentSubmit={uploadTargetContentComment}
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
    </ErrorBoundary>
  );

  async function applyFilter(filter) {
    if (filter === subFilter) return;
    categoryRef.current = 'uploads';
    changeCategory('uploads');
    changeSubFilter(filter);
    clearFeeds();
    const { data, filter: newFilter } = await loadFeeds({ filter });
    if (filter === newFilter && categoryRef.current === 'uploads') {
      fetchFeeds(data);
      setDisplayOrder('desc');
      setScrollHeight(0);
    }
  }

  async function loadMoreFeeds() {
    try {
      await fetchMoreFeeds({
        order: displayOrder,
        orderBy: categoryObj[category].orderBy,
        shownFeeds: queryStringForArray({
          array: storyFeeds,
          originVar: 'feedId',
          destinationVar: 'shownFeeds'
        }),
        filter:
          category === 'uploads' ? subFilter : categoryObj[category].filter
      });
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleChangeCategory(newCategory) {
    clearFeeds();
    categoryRef.current = newCategory;
    changeCategory(newCategory);
    changeSubFilter(categoryObj[newCategory].filter);
    const { filter, data } = await loadFeeds({
      order: 'desc',
      filter: categoryObj[newCategory].filter,
      orderBy: categoryObj[newCategory].orderBy
    });
    if (
      filter === categoryObj[newCategory].filter &&
      categoryRef.current === newCategory
    ) {
      fetchFeeds(data);
      setDisplayOrder('desc');
      setScrollHeight(0);
    }
  }

  async function handleFetchNewFeeds() {
    if (category !== 'uploads' || displayOrder === 'asc') {
      clearFeeds();
      resetNumNewPosts();
      categoryRef.current = 'uploads';
      changeCategory('uploads');
      const { data, filter } = await loadFeeds();
      if (
        filter === categoryObj.uploads.filter &&
        categoryRef.current === 'uploads'
      ) {
        fetchFeeds(data);
      }
      return;
    }
    if (!loadingNewFeeds) {
      setLoadingNewFeeds(true);
      resetNumNewPosts();
      const data = await loadNewFeeds({
        lastInteraction: storyFeeds[0] ? storyFeeds[0].lastInteraction : 0,
        shownFeeds: queryStringForArray({
          array: storyFeeds,
          originVar: 'feedId',
          destinationVar: 'shownFeeds'
        })
      });
      if (data) fetchNewFeeds(data);
      setLoadingNewFeeds(false);
    }
  }

  async function handleDisplayOrder() {
    const newDisplayOrder = displayOrder === 'desc' ? 'asc' : 'desc';
    clearFeeds();
    const initialFilter =
      category === 'uploads' ? subFilter : categoryObj[category].filter;
    const { data, filter } = await loadFeeds({
      order: newDisplayOrder,
      orderBy: categoryObj[category].orderBy,
      filter: initialFilter
    });
    if (filter === initialFilter) {
      fetchFeeds(data);
      setDisplayOrder(newDisplayOrder);
      setScrollHeight(0);
    }
  }

  function handleUploadFeedComment({ feed, data }) {
    uploadFeedComment({
      data,
      type: feed.type,
      contentId: feed.contentId
    });
  }
}

export default connect(
  state => ({
    category: state.FeedReducer.category,
    hideWatched: state.UserReducer.hideWatched,
    loadMoreButton: state.FeedReducer.storyFeedsLoadMoreButton,
    storyFeeds: state.FeedReducer.storyFeeds,
    loaded: state.FeedReducer.loaded,
    numNewPosts: state.NotiReducer.numNewPosts,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    chatMode: state.ChatReducer.chatMode,
    noFeeds: state.FeedReducer.noFeeds,
    searchMode: state.SearchReducer.searchMode,
    subFilter: state.FeedReducer.subFilter
  }),
  {
    addTags,
    addTagToContents,
    attachStar,
    changeByUserStatus,
    changeCategory,
    changeSubFilter,
    contentFeedLike,
    fetchMoreFeeds,
    fetchFeed,
    fetchFeeds,
    fetchNewFeeds,
    feedCommentDelete,
    feedContentDelete,
    feedContentEdit,
    feedCommentEdit,
    feedRewardCommentEdit,
    loadMoreFeedComments,
    loadMoreFeedReplies,
    loadRepliesOfReply,
    loadTags,
    clearFeeds,
    resetNumNewPosts,
    setCurrentSection,
    setDifficulty,
    showFeedComments,
    toggleHideWatched,
    uploadFeedComment,
    uploadTargetContentComment
  }
)(Stories);
