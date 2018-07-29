import React, { Component } from 'react'
import { Route } from 'react-router'
import {
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
  showFeedComments,
  uploadFeedComment,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import ContentPanel from 'components/ContentPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import { queryStringForArray } from 'helpers/stringHelpers'
import FilterBar from 'components/FilterBar'

class Body extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    feeds: PropTypes.array,
    attachStar: PropTypes.func.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
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
    showFeedComments: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    myId: PropTypes.number
  }

  state = {
    currentTab: 'all',
    loading: false
  }

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {}

  componentDidMount() {
    const { clearFeeds } = this.props
    this.mounted = true
    addEvent(this.body, 'scroll', this.onScroll)
    addEvent(document.getElementById('App'), 'scroll', this.onScroll)
    clearFeeds()
    this.loadContent()
  }

  componentDidUpdate(prevProps) {
    const { clearFeeds } = this.props
    if (prevProps.location !== this.props.location) {
      clearFeeds()
      this.loadContent()
    }
  }

  componentWillUnmount() {
    this.mounted = false
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll)
  }

  render() {
    const {
      match: route,
      match: {
        params: { username }
      },
      history,
      feeds,
      myId,
      loaded,
      loadMoreButton,
      attachStar,
      contentFeedLike,
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
      showFeedComments,
      uploadTargetContentComment
    } = this.props
    const { loading } = this.state

    return (
      <div
        ref={ref => {
          this.Container = ref
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
                  clearFeeds()
                  history.push(route.url)
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
                  clearFeeds()
                  history.push(`${route.url}/posts`)
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
                  clearFeeds()
                  history.push(`${route.url}/comments`)
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
                  clearFeeds()
                  history.push(`${route.url}/videos`)
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
                  clearFeeds()
                  history.push(`${route.url}/links`)
                }}
              >
                <a>Links</a>
              </nav>
            )}
          />
        </FilterBar>
        <div>
          {!loaded && <Loading text="Loading..." />}
          {loaded &&
            feeds.length > 0 && (
              <div>
                {feeds.map(feed => {
                  return (
                    <ContentPanel
                      key={feed.feedId}
                      commentsLoadLimit={5}
                      contentObj={feed}
                      inputAtBottom={feed.type === 'comment'}
                      onLoadContent={fetchFeed}
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
                      onReplySubmit={data =>
                        this.uploadFeedComment({ feed, data })
                      }
                      onStarVideo={feedVideoStar}
                      onShowComments={showFeedComments}
                      onTargetCommentSubmit={uploadTargetContentComment}
                      userId={myId}
                    />
                  )
                })}
              </div>
            )}
          {loaded &&
            feeds.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '15rem'
                }}
              >
                <h2>{this.onNoFeed(username)}</h2>
              </div>
            )}
        </div>
        {loadMoreButton && (
          <LoadMoreButton
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
            onClick={this.loadMoreFeeds}
            loading={loading}
          />
        )}
      </div>
    )
  }

  loadContent = () => {
    const { match, location } = this.props
    switch (location.pathname) {
      case match.url:
        return this.loadTab('all')
      case `${match.url}/posts`:
        return this.loadTab('post')
      case `${match.url}/comments`:
        return this.loadTab('comment')
      case `${match.url}/videos`:
        return this.loadTab('video')
      case `${match.url}/links`:
        return this.loadTab('url')
      default:
        break
    }
  }

  loadTab = tabName => {
    const {
      match: {
        params: { username }
      },
      fetchFeeds
    } = this.props
    if (this.mounted) {
      this.setState({ currentTab: tabName })
    }
    fetchFeeds({ username, filter: tabName })
  }

  loadMoreFeeds = async() => {
    const {
      match: {
        params: { username }
      },
      fetchMoreFeeds,
      feeds
    } = this.props
    const { currentTab, loading } = this.state

    if (!loading) {
      this.setState({ loading: true })
      try {
        await fetchMoreFeeds({
          shownFeeds: queryStringForArray(feeds, 'feedId', 'shownFeeds'),
          filter: currentTab,
          username
        })
        this.setState({ loading: false })
      } catch (error) {
        console.error(error)
      }
    }
  }

  onNoFeed = username => {
    const { currentTab } = this.state
    switch (currentTab) {
      case 'all':
        return `${username} has not uploaded anything, yet`
      case 'post':
        return `${username} has not uploaded a post, yet`
      case 'comment':
        return `${username} has not uploaded a comment, yet`
      case 'url':
        return `${username} has not uploaded a link, yet`
      case 'video':
        return `${username} has not uploaded a video, yet`
    }
  }

  onScroll = () => {
    let { chatMode, feeds } = this.props
    if (!chatMode && feeds.length > 0) {
      this.setState({
        scrollPosition: {
          desktop: document.getElementById('App').scrollTop,
          mobile: this.body.scrollTop
        }
      })
      if (
        this.state.scrollPosition.desktop >=
          this.Container.offsetHeight - window.innerHeight - 500 ||
        this.state.scrollPosition.mobile >=
          this.Container.offsetHeight - window.innerHeight - 500
      ) {
        this.loadMoreFeeds()
      }
    }
  }

  uploadFeedComment = ({ feed, data }) => {
    const { uploadFeedComment } = this.props
    uploadFeedComment({
      data,
      type: feed.type,
      contentId: feed.contentId
    })
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    feeds: state.FeedReducer.feeds,
    loaded: state.FeedReducer.loaded,
    myId: state.UserReducer.userId,
    loadMoreButton: state.FeedReducer.loadMoreButton,
    homeComponentConnected: state.FeedReducer.homeComponentConnected
  }),
  {
    attachStar,
    contentFeedLike,
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
    showFeedComments,
    uploadFeedComment,
    uploadTargetContentComment
  }
)(Body)
