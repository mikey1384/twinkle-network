import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import FilterBar from 'components/FilterBar';
import SideMenu from './SideMenu';
import { disableAutoscroll } from 'redux/actions/ViewActions';
import { css } from 'emotion';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { queryStringForArray } from 'helpers/stringHelpers';
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
import { connect } from 'react-redux';

class Posts extends Component {
  static propTypes = {
    addTags: PropTypes.func.isRequired,
    addTagToContents: PropTypes.func.isRequired,
    attachStar: PropTypes.func.isRequired,
    clearFeeds: PropTypes.func.isRequired,
    chatMode: PropTypes.bool.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    disableAutoscroll: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    feedCommentDelete: PropTypes.func.isRequired,
    feedContentDelete: PropTypes.func.isRequired,
    feedCommentEdit: PropTypes.func.isRequired,
    feedContentEdit: PropTypes.func.isRequired,
    feedRewardCommentEdit: PropTypes.func.isRequired,
    feedVideoStar: PropTypes.func.isRequired,
    fetchFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreFeedComments: PropTypes.func.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    loadTags: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myId: PropTypes.number,
    profileFeeds: PropTypes.array.isRequired,
    searchMode: PropTypes.bool.isRequired,
    showFeedComments: PropTypes.func.isRequired,
    setCurrentSection: PropTypes.func.isRequired,
    setDifficulty: PropTypes.func,
    uploadTargetContentComment: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired
  };

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {};

  filterTable = {
    all: 'all',
    posts: 'post',
    videos: 'video',
    links: 'url'
  };

  scrollHeight = 0;

  state = {
    loading: false
  };

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
      myId,
      addTags,
      addTagToContents,
      attachStar,
      contentFeedLike,
      fetchFeed,
      feedCommentDelete,
      feedContentDelete,
      feedCommentEdit,
      feedContentEdit,
      feedRewardCommentEdit,
      feedVideoStar,
      loadMoreFeedComments,
      loadMoreFeedReplies,
      loaded,
      loadMoreButton,
      loadTags,
      match,
      profileFeeds,
      showFeedComments,
      uploadTargetContentComment,
      username,
      setDifficulty
    } = this.props;
    const { loading } = this.state;
    return (
      <>
        <FilterBar className="mobile">
          {[
            { key: 'all', label: 'All' },
            { key: 'post', label: 'Discussions' },
            { key: 'video', label: 'Videos' },
            { key: 'url', label: 'Links' }
          ].map(type => {
            return (
              <nav
                key={type.key}
                className={match.params.section === type.key ? 'active' : ''}
                onClick={() => this.onClickPostsMenu({ item: type.key })}
              >
                {type.label}
              </nav>
            );
          })}
        </FilterBar>
        <div style={{ width: '80vw', display: 'flex' }}>
          <div style={{ width: 'CALC(100% - 25rem)', marginBottom: '1rem' }}>
            {!loaded && (
              <Loading style={{ marginBottom: '50vh' }} text="Loading..." />
            )}
            {loaded &&
              profileFeeds.length > 0 &&
              profileFeeds.map(feed => {
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
            {loaded &&
              profileFeeds.length === 0 && (
                <div
                  style={{
                    marginTop: '6rem',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    {this.onNoFeed(username)}
                  </div>
                </div>
              )}
            {loadMoreButton && (
              <LoadMoreButton
                onClick={this.loadMoreFeeds}
                loading={loading}
                filled
                info
              />
            )}
          </div>
          <SideMenu
            className={`desktop ${css`
              width: 30rem;
            `}`}
            menuItems={[
              { key: 'all', label: 'All' },
              { key: 'post', label: 'Discussions' },
              { key: 'video', label: 'Videos' },
              { key: 'url', label: 'Links' }
            ]}
            onMenuClick={this.onClickPostsMenu}
            selectedKey={this.filterTable[match.params.section]}
          />
        </div>
      </>
    );
  }

  loadMoreFeeds = async() => {
    const {
      match: {
        params: { username }
      },
      fetchMoreFeeds,
      profileFeeds
    } = this.props;
    const { selectedSection } = this.props;
    const { loading } = this.state;

    if (!loading) {
      this.setState({ loading: true });
      try {
        await fetchMoreFeeds({
          shownFeeds: queryStringForArray({
            array: profileFeeds,
            originVar: 'feedId',
            destinationVar: 'shownFeeds'
          }),
          filter: selectedSection,
          username
        });
        if (this.mounted) {
          this.setState({ loading: false });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  loadContent = () => {
    const { match } = this.props;
    document.getElementById('App').scrollTop = 0;
    this.loadTab(match.params.section);
  };

  loadTab = tabName => {
    const {
      match: {
        params: { username }
      },
      fetchFeeds
    } = this.props;
    fetchFeeds({ username, filter: this.filterTable[tabName] });
    this.scrollHeight = 0;
  };

  onClickPostsMenu = ({ item }) => {
    const { disableAutoscroll, history, username } = this.props;
    disableAutoscroll();
    history.push(
      `/users/${username}/${item === 'url' ? 'link' : item}${
        item === 'all' ? '' : 's'
      }`
    );
  };

  onNoFeed = username => {
    const { match } = this.props;
    switch (match.params.section) {
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
)(Posts);
