import React, { Component } from 'react';
import { Route } from 'react-router';
import {
  addTags,
  addTagToContents,
  attachStar,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedContentEdit,
  feedRewardCommentEdit,
  feedVideoStar,
  fetchFeed,
  fetchFeeds,
  fetchMoreFeeds,
  clearFeeds,
  loadMoreFeedComments,
  loadMoreFeedReplies,
  loadTags,
  setCurrentSection,
  setDifficulty,
  showFeedComments,
  uploadFeedComment,
  uploadTargetContentComment
} from 'redux/actions/FeedActions';
import { disableAutoscroll } from 'redux/actions/ViewActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import FilterBar from 'components/FilterBar';

class Body extends Component {
  static propTypes = {
    addTags: PropTypes.func.isRequired,
    addTagToContents: PropTypes.func.isRequired,
    attachStar: PropTypes.func.isRequired,
    chatMode: PropTypes.bool.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    disableAutoscroll: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    fetchFeeds: PropTypes.func.isRequired,
    fetchMoreFeeds: PropTypes.func.isRequired,
    clearFeeds: PropTypes.func.isRequired,
    feedCommentDelete: PropTypes.func.isRequired,
    feedContentDelete: PropTypes.func.isRequired,
    feedCommentEdit: PropTypes.func.isRequired,
    feedContentEdit: PropTypes.func.isRequired,
    feedRewardCommentEdit: PropTypes.func.isRequired,
    feedVideoStar: PropTypes.func.isRequired,
    loadMoreFeedComments: PropTypes.func.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    loadTags: PropTypes.func.isRequired,
    setCurrentSection: PropTypes.func.isRequired,
    showFeedComments: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myId: PropTypes.number,
    profileFeeds: PropTypes.array,
    searchMode: PropTypes.bool.isRequired,
    setDifficulty: PropTypes.func
  };

  state = {
    currentTab: 'all',
    loading: false
  };

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {};

  scrollHeight = 0;

  componentDidMount() {
    const { clearFeeds, setCurrentSection } = this.props;
    setCurrentSection('profileFeeds');
    this.mounted = true;
    addEvent(window, 'scroll', this.onScroll);
    addEvent(document.getElementById('App'), 'scroll', this.onScroll);
    clearFeeds();
    this.loadContent();
  }

  componentDidUpdate(prevProps) {
    const { clearFeeds } = this.props;
    if (prevProps.location !== this.props.location) {
      clearFeeds();
      this.loadContent();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    removeEvent(window, 'scroll', this.onScroll);
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll);
  }

  render() {
    const {
      match: route,
      match: {
        params: { username }
      },
      history,
      profileFeeds,
      myId,
      loaded,
      loadMoreButton,
      addTags,
      addTagToContents,
      attachStar,
      contentFeedLike,
      disableAutoscroll,
      fetchFeed,
      clearFeeds,
      feedCommentDelete,
      feedContentDelete,
      feedCommentEdit,
      feedContentEdit,
      feedRewardCommentEdit,
      feedVideoStar,
      loadMoreFeedComments,
      loadMoreFeedReplies,
      loadTags,
      setDifficulty,
      showFeedComments,
      uploadTargetContentComment
    } = this.props;
    const { loading } = this.state;
    return (
      <div
        ref={ref => {
          this.Container = ref;
        }}
        style={{ height: '100%', marginBottom: '1rem' }}
      >
        <FilterBar bordered>
          <Route
            exact
            path={route.url}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  clearFeeds();
                  disableAutoscroll();
                  history.push(route.url);
                }}
              >
                <a>All</a>
              </nav>
            )}
          />
          <Route
            exact
            path={`${route.url}/posts`}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  clearFeeds();
                  disableAutoscroll();
                  history.push(`${route.url}/posts`);
                }}
              >
                <a>Posts</a>
              </nav>
            )}
          />
          <Route
            exact
            path={`${route.url}/comments`}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  clearFeeds();
                  disableAutoscroll();
                  history.push(`${route.url}/comments`);
                }}
              >
                <a>Comments</a>
              </nav>
            )}
          />
          <Route
            exact
            path={`${route.url}/videos`}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  clearFeeds();
                  disableAutoscroll();
                  history.push(`${route.url}/videos`);
                }}
              >
                <a>Videos</a>
              </nav>
            )}
          />
          <Route
            exact
            path={`${route.url}/links`}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  clearFeeds();
                  disableAutoscroll();
                  history.push(`${route.url}/links`);
                }}
              >
                <a>Links</a>
              </nav>
            )}
          />
        </FilterBar>
        <div>
          {!loaded && (
            <Loading style={{ marginBottom: '50vh' }} text="Loading..." />
          )}
          {loaded &&
            profileFeeds.length > 0 && (
              <div>
                {profileFeeds.map(feed => {
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
                      onLoadTags={loadTags}
                      onReplySubmit={data =>
                        this.uploadFeedComment({ feed, data })
                      }
                      onSetDifficulty={setDifficulty}
                      onStarVideo={feedVideoStar}
                      onShowComments={showFeedComments}
                      onTargetCommentSubmit={uploadTargetContentComment}
                      userId={myId}
                    />
                  );
                })}
              </div>
            )}
          {loaded &&
            profileFeeds.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '15rem'
                }}
              >
                <h2 style={{ textAlign: 'center' }}>
                  {this.onNoFeed(username)}
                </h2>
              </div>
            )}
        </div>
        {loadMoreButton && (
          <LoadMoreButton
            style={{ marginTop: '1rem' }}
            onClick={this.loadMoreFeeds}
            loading={loading}
            filled
            info
          />
        )}
      </div>
    );
  }

  loadContent = () => {
    const { match, location } = this.props;
    switch (location.pathname) {
      case match.url:
        return this.loadTab('all');
      case `${match.url}/posts`:
        return this.loadTab('post');
      case `${match.url}/comments`:
        return this.loadTab('comment');
      case `${match.url}/videos`:
        return this.loadTab('video');
      case `${match.url}/links`:
        return this.loadTab('url');
      default:
        break;
    }
  };

  loadTab = tabName => {
    const {
      match: {
        params: { username }
      },
      fetchFeeds
    } = this.props;
    if (this.mounted) {
      this.setState({ currentTab: tabName });
    }
    fetchFeeds({ username, filter: tabName });
    this.scrollHeight = 0;
  };

  loadMoreFeeds = async() => {
    const {
      match: {
        params: { username }
      },
      fetchMoreFeeds,
      profileFeeds
    } = this.props;
    const { currentTab, loading } = this.state;

    if (!loading) {
      this.setState({ loading: true });
      try {
        await fetchMoreFeeds({
          shownFeeds: queryStringForArray({
            array: profileFeeds,
            originVar: 'feedId',
            destinationVar: 'shownFeeds'
          }),
          filter: currentTab,
          username
        });
        this.setState({ loading: false });
      } catch (error) {
        console.error(error);
      }
    }
  };

  onNoFeed = username => {
    const { currentTab } = this.state;
    switch (currentTab) {
      case 'all':
        return `${username} has not uploaded anything, yet`;
      case 'post':
        return `${username} has not uploaded a post, yet`;
      case 'comment':
        return `${username} has not uploaded a comment, yet`;
      case 'url':
        return `${username} has not uploaded a link, yet`;
      case 'video':
        return `${username} has not uploaded a video, yet`;
    }
  };

  onScroll = () => {
    let { chatMode, loadMoreButton, profileFeeds, searchMode } = this.props;
    if (
      document.getElementById('App').scrollHeight > this.scrollHeight ||
      this.body.scrollTop > this.scrollHeight
    ) {
      this.scrollHeight = Math.max(
        document.getElementById('App').scrollHeight,
        this.body.scrollTop
      );
    }
    if (!chatMode && !searchMode && profileFeeds.length > 0) {
      this.setState({
        scrollPosition: {
          desktop: document.getElementById('App').scrollTop,
          mobile: this.body.scrollTop
        }
      });
      if (
        (this.state.scrollPosition.desktop >=
          this.scrollHeight - window.innerHeight - 500 ||
          this.state.scrollPosition.mobile >=
            this.scrollHeight - window.innerHeight - 500) &&
        loadMoreButton
      ) {
        this.loadMoreFeeds();
      }
    }
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
    chatMode: state.ChatReducer.chatMode,
    profileFeeds: state.FeedReducer.profileFeeds,
    loaded: state.FeedReducer.loaded,
    myId: state.UserReducer.userId,
    loadMoreButton: state.FeedReducer.profileFeedsLoadMoreButton,
    homeComponentConnected: state.FeedReducer.homeComponentConnected,
    searchMode: state.SearchReducer.searchMode
  }),
  {
    addTags,
    addTagToContents,
    attachStar,
    contentFeedLike,
    disableAutoscroll,
    fetchFeed,
    fetchFeeds,
    fetchMoreFeeds,
    clearFeeds,
    feedCommentDelete,
    feedContentDelete,
    feedCommentEdit,
    feedContentEdit,
    feedRewardCommentEdit,
    feedVideoStar,
    loadMoreFeedComments,
    loadMoreFeedReplies,
    loadTags,
    setCurrentSection,
    setDifficulty,
    showFeedComments,
    uploadFeedComment,
    uploadTargetContentComment
  }
)(Body);
