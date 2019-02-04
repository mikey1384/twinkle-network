import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  addTags,
  addTagToContents,
  attachStar,
  changeByUserStatus,
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
import { clearProfiles, toggleHideWatched } from 'redux/actions/UserActions';
import { resetNumNewPosts } from 'redux/actions/NotiActions';
import InputPanel from './InputPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import { connect } from 'react-redux';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import Banner from 'components/Banner';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { queryStringForArray } from 'helpers/stringHelpers';
import { loadNewFeeds } from 'helpers/requestHelpers';
import HomeFilter from './HomeFilter';

class Stories extends Component {
  static propTypes = {
    addTags: PropTypes.func.isRequired,
    addTagToContents: PropTypes.func.isRequired,
    attachStar: PropTypes.func.isRequired,
    changeByUserStatus: PropTypes.func.isRequired,
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    clearProfiles: PropTypes.func.isRequired,
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
    selectedFilter: PropTypes.string.isRequired,
    setCurrentSection: PropTypes.func.isRequired,
    setDifficulty: PropTypes.func,
    showFeedComments: PropTypes.func.isRequired,
    storyFeeds: PropTypes.array.isRequired,
    toggleHideWatched: PropTypes.func.isRequired,
    username: PropTypes.string,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  scrollHeight = 0;

  categoryObj = {
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

  state = {
    category: 'uploads',
    displayOrder: 'desc',
    loadingMore: false
  };

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {};

  async componentDidMount() {
    let {
      history,
      clearFeeds,
      clearProfiles,
      fetchFeeds,
      loaded,
      resetNumNewPosts,
      setCurrentSection
    } = this.props;
    clearProfiles();
    setCurrentSection('storyFeeds');
    resetNumNewPosts();
    if (history.action === 'PUSH' || !loaded) {
      clearFeeds();
      fetchFeeds();
    }
    addEvent(window, 'scroll', this.onScroll);
    addEvent(document.getElementById('App'), 'scroll', this.onScroll);
  }

  componentDidUpdate(prevProps) {
    const { clearFeeds, fetchFeeds } = this.props;
    if (
      prevProps.hideWatched !== this.props.hideWatched &&
      this.state.category === 'videos'
    ) {
      clearFeeds();
      fetchFeeds({
        order: 'desc',
        filter: this.categoryObj.videos.filter,
        orderBy: this.categoryObj.videos.orderBy
      });
    }
  }

  componentWillUnmount() {
    removeEvent(window, 'scroll', this.onScroll);
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll);
  }

  render() {
    const {
      addTags,
      addTagToContents,
      attachStar,
      changeByUserStatus,
      contentFeedLike,
      feedCommentDelete,
      feedCommentEdit,
      feedContentDelete,
      feedContentEdit,
      feedRewardCommentEdit,
      fetchFeed,
      hideWatched,
      loadMoreButton,
      loadMoreFeedReplies,
      loadTags,
      numNewPosts,
      userId,
      loaded,
      loadMoreFeedComments,
      loadRepliesOfReply,
      selectedFilter,
      setDifficulty,
      showFeedComments,
      storyFeeds,
      toggleHideWatched,
      uploadTargetContentComment,
      username
    } = this.props;
    const { category, displayOrder, loadingMore } = this.state;
    return (
      <ErrorBoundary>
        <div
          ref={ref => {
            this.Container = ref;
          }}
          style={{ position: 'relative', width: '100%', paddingBottom: '1rem' }}
        >
          <HomeFilter
            category={category}
            changeCategory={this.changeCategory}
            displayOrder={displayOrder}
            hideWatched={hideWatched}
            selectedFilter={selectedFilter}
            applyFilter={this.applyFilter}
            setDisplayOrder={this.setDisplayOrder}
            toggleHideWatched={toggleHideWatched}
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
                    gold
                    onClick={this.fetchNewFeeds}
                    style={{ marginBottom: '1rem' }}
                  >
                    Click to See {numNewPosts} new Post
                    {numNewPosts > 1 ? 's' : ''}
                  </Banner>
                )}
                {storyFeeds.map(feed => {
                  return (
                    <ContentPanel
                      key={feed.feedId}
                      commentsLoadLimit={5}
                      contentObj={feed}
                      inputAtBottom={feed.type === 'comment'}
                      onLoadContent={fetchFeed}
                      onAddTags={addTags}
                      onAddTagToContents={addTagToContents}
                      onAttachStar={attachStar}
                      onByUserStatusChange={changeByUserStatus}
                      onCommentSubmit={data =>
                        this.uploadFeedComment({ feed, data })
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
                        this.uploadFeedComment({ feed, data })
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
                    onClick={this.loadMoreFeeds}
                    loading={loadingMore}
                    filled
                    info
                  />
                )}
              </>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  applyFilter = filter => {
    const { fetchFeeds, selectedFilter, clearFeeds } = this.props;
    if (filter === selectedFilter) return;
    clearFeeds();
    fetchFeeds({ filter });
    this.setState({ displayOrder: 'desc' });
  };

  loadMoreFeeds = async() => {
    const { storyFeeds, fetchMoreFeeds, selectedFilter } = this.props;
    const { category, displayOrder, loadingMore } = this.state;
    if (!loadingMore) {
      this.setState({ loadingMore: true });
      try {
        await fetchMoreFeeds({
          order: displayOrder,
          orderBy: this.categoryObj[category].orderBy,
          shownFeeds: queryStringForArray({
            array: storyFeeds,
            originVar: 'feedId',
            destinationVar: 'shownFeeds'
          }),
          filter:
            category === 'uploads'
              ? selectedFilter
              : this.categoryObj[category].filter
        });
        this.setState({ loadingMore: false });
      } catch (error) {
        console.error(error);
      }
    }
  };

  onScroll = () => {
    const { chatMode, searchMode, storyFeeds, loadMoreButton } = this.props;
    if (
      document.getElementById('App').scrollHeight > this.scrollHeight ||
      this.body.scrollTop > this.scrollHeight
    ) {
      this.scrollHeight = Math.max(
        document.getElementById('App').scrollHeight,
        this.body.scrollTop
      );
    }
    if (
      !searchMode &&
      !chatMode &&
      storyFeeds.length > 0 &&
      this.scrollHeight !== 0
    ) {
      this.setState(
        {
          scrollPosition: {
            desktop: document.getElementById('App').scrollTop,
            mobile: this.body.scrollTop
          }
        },
        () => {
          if (
            (this.state.scrollPosition.desktop >=
              this.scrollHeight - window.innerHeight - 400 ||
              this.state.scrollPosition.mobile >=
                this.scrollHeight - window.innerHeight - 400) &&
            loadMoreButton
          ) {
            this.loadMoreFeeds();
          }
        }
      );
    }
  };

  changeCategory = category => {
    const { clearFeeds, fetchFeeds } = this.props;
    clearFeeds();
    fetchFeeds({
      order: 'desc',
      filter: this.categoryObj[category].filter,
      orderBy: this.categoryObj[category].orderBy
    });
    this.setState({ displayOrder: 'desc', category });
    this.scrollHeight = 0;
  };

  fetchNewFeeds = async() => {
    const {
      clearFeeds,
      fetchFeeds,
      storyFeeds = [],
      resetNumNewPosts,
      fetchNewFeeds
    } = this.props;
    const { category, displayOrder, loadingMore } = this.state;
    if (category !== 'uploads' || displayOrder === 'asc') {
      clearFeeds();
      resetNumNewPosts();
      this.setState({ category: 'uploads' });
      return fetchFeeds();
    }
    if (!loadingMore) {
      this.setState({ loadingMore: true });
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
      this.setState({ loadingMore: false });
    }
  };

  setDisplayOrder = () => {
    const { clearFeeds, fetchFeeds, selectedFilter } = this.props;
    const { category, displayOrder } = this.state;
    const newDisplayOrder = displayOrder === 'desc' ? 'asc' : 'desc';
    clearFeeds();
    fetchFeeds({
      order: newDisplayOrder,
      orderBy: this.categoryObj[category].orderBy,
      filter:
        category === 'uploads'
          ? selectedFilter
          : this.categoryObj[category].filter
    });
    this.setState({ displayOrder: newDisplayOrder });
    this.scrollHeight = 0;
  };

  uploadFeedComment = ({ feed, data }) => {
    const { uploadFeedComment } = this.props;
    uploadFeedComment({
      data,
      type: feed.type,
      contentId: feed.contentId
    });
  };
}

export default connect(
  state => ({
    hideWatched: state.UserReducer.hideWatched,
    loadMoreButton: state.FeedReducer.storyFeedsLoadMoreButton,
    storyFeeds: state.FeedReducer.storyFeeds,
    loaded: state.FeedReducer.loaded,
    numNewPosts: state.NotiReducer.numNewPosts,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    selectedFilter: state.FeedReducer.selectedFilter,
    chatMode: state.ChatReducer.chatMode,
    noFeeds: state.FeedReducer.noFeeds,
    searchMode: state.SearchReducer.searchMode
  }),
  {
    addTags,
    addTagToContents,
    attachStar,
    changeByUserStatus,
    clearProfiles,
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
