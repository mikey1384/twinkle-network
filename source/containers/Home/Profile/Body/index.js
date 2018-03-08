import React, { Component } from 'react'
import { Route } from 'react-router'
import {
  commentFeedLike,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedContentEdit,
  feedVideoStar,
  fetchFeed,
  fetchUserFeeds,
  fetchMoreUserFeeds,
  likeTargetComment,
  clearFeeds,
  loadMoreFeedCommentsAsync,
  loadMoreFeedReplies,
  questionFeedLike,
  showFeedCommentsAsync,
  uploadFeedComment,
  uploadFeedReply,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import ContentPanel from 'components/ContentPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import FilterBar from 'components/FilterBar'

class Body extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    commentFeedLike: PropTypes.func.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    feeds: PropTypes.array,
    feedCommentDelete: PropTypes.func.isRequired,
    feedCommentEdit: PropTypes.func.isRequired,
    feedContentDelete: PropTypes.func.isRequired,
    feedContentEdit: PropTypes.func.isRequired,
    feedVideoStar: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    fetchMoreUserFeeds: PropTypes.func.isRequired,
    fetchUserFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    likeTargetComment: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreFeedCommentsAsync: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    questionFeedLike: PropTypes.func.isRequired,
    showFeedCommentsAsync: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadFeedReply: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    myId: PropTypes.number
  }

  constructor() {
    super()
    this.state = {
      currentTab: 'all',
      loading: false
    }
    this.changeTab = this.changeTab.bind(this)
    this.onNoFeed = this.onNoFeed.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
  }

  componentDidMount() {
    const { match, location, clearFeeds } = this.props
    this.mounted = true
    addEvent(document.getElementById('react-view'), 'scroll', this.onScroll)
    return clearFeeds().then(() => {
      switch (location.pathname) {
        case match.url:
          return this.changeTab('all')
        case `${match.url}/questions`:
          return this.changeTab('question')
        case `${match.url}/comments`:
          return this.changeTab('comment')
        case `${match.url}/videos`:
          return this.changeTab('video')
        case `${match.url}/links`:
          return this.changeTab('url')
        case `${match.url}/discussions`:
          return this.changeTab('discussion')
        default:
          break
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { match, location, clearFeeds } = this.props

    if (prevProps.location !== this.props.location) {
      return clearFeeds().then(() => {
        switch (location.pathname) {
          case match.url:
            return this.changeTab('all')
          case `${match.url}/questions`:
            return this.changeTab('question')
          case `${match.url}/comments`:
            return this.changeTab('comment')
          case `${match.url}/videos`:
            return this.changeTab('video')
          case `${match.url}/links`:
            return this.changeTab('url')
          case `${match.url}/discussions`:
            return this.changeTab('discussion')
          default:
            break
        }
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false
    removeEvent(document.getElementById('react-view'), 'scroll', this.onScroll)
  }

  render() {
    const {
      commentFeedLike,
      contentFeedLike,
      match: route,
      match: { params: { username } },
      history,
      likeTargetComment,
      loadMoreFeedReplies,
      feeds,
      feedCommentDelete,
      feedCommentEdit,
      feedContentDelete,
      feedContentEdit,
      feedVideoStar,
      fetchFeed,
      loadMoreFeedCommentsAsync,
      myId,
      loaded,
      loadMoreButton,
      clearFeeds,
      questionFeedLike,
      showFeedCommentsAsync,
      uploadFeedComment,
      uploadFeedReply,
      uploadTargetContentComment
    } = this.props
    const { loading } = this.state

    return (
      <div
        ref={ref => {
          this.Container = ref
        }}
        style={{ height: '100%' }}
      >
        <FilterBar bordered>
          <Route
            exact
            path={route.url}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => clearFeeds().then(() => history.push(route.url))}
              >
                <a>All</a>
              </nav>
            )}
          />
          <Route
            exact
            path={`${route.url}/questions`}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  clearFeeds().then(() =>
                    history.push(`${route.url}/questions`)
                  )
                }
              >
                <a>Questions</a>
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
                onClick={() =>
                  clearFeeds().then(() => history.push(`${route.url}/comments`))
                }
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
                onClick={() =>
                  clearFeeds().then(() => history.push(`${route.url}/videos`))
                }
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
                onClick={() =>
                  clearFeeds().then(() => history.push(`${route.url}/links`))
                }
              >
                <a>Links</a>
              </nav>
            )}
          />
          <Route
            exact
            path={`${route.url}/discussions`}
            children={({ match }) => (
              <nav
                className={match ? 'active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  clearFeeds().then(() =>
                    history.push(`${route.url}/discussions`)
                  )
                }
              >
                <a>Discussions</a>
              </nav>
            )}
          />
        </FilterBar>
        <div style={{ position: 'relative', height: '100%' }}>
          {!loaded && <Loading />}
          {loaded &&
            feeds.length > 0 && (
              <div>
                {feeds.map(feed => {
                  return (
                    <ContentPanel
                      key={`${feed.type}${feed.id}`}
                      contentObj={feed}
                      userId={myId}
                      methodObj={{
                        onFetchContent: fetchFeed,
                        onCommentSubmit: uploadFeedComment,
                        onReplySubmit: uploadFeedReply,
                        onTargetCommentSubmit: uploadTargetContentComment,
                        onLikeContent: contentFeedLike,
                        onLikeComment: commentFeedLike,
                        onLikeTargetComment: likeTargetComment,
                        onLikeQuestion: questionFeedLike,
                        onDeleteContent: feedContentDelete,
                        onEditContent: feedContentEdit,
                        onDeleteComment: feedCommentDelete,
                        onEditComment: feedCommentEdit,
                        onLoadMoreComments: loadMoreFeedCommentsAsync,
                        onLoadMoreReplies: loadMoreFeedReplies,
                        onShowComments: showFeedCommentsAsync,
                        onVideoStar: feedVideoStar
                      }}
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
            style={{ marginBottom: '1rem' }}
            onClick={this.loadMoreFeeds}
            loading={loading}
          />
        )}
      </div>
    )
  }

  changeTab(tabName) {
    const { match: { params: { username } }, fetchUserFeeds } = this.props
    if (this.mounted) {
      this.setState({ currentTab: tabName })
    }
    fetchUserFeeds(username, tabName)
  }

  loadMoreFeeds() {
    const {
      match: { params: { username } },
      fetchMoreUserFeeds,
      feeds
    } = this.props
    const { currentTab, loading } = this.state

    if (!loading) {
      this.setState({ loading: true })
      return fetchMoreUserFeeds(
        username,
        currentTab,
        feeds[feeds.length - 1].id
      ).then(() => this.setState({ loading: false }))
    }
  }

  onNoFeed(username) {
    const { currentTab } = this.state
    switch (currentTab) {
      case 'all':
        return `${username} has not posted anything, yet`
      case 'question':
        return `${username} has not posted a question, yet`
      case 'comment':
        return `${username} has not posted a comment, yet`
      case 'url':
        return `${username} has not posted a link, yet`
      case 'video':
        return `${username} has not posted a video, yet`
      case 'discussion':
        return `${username} has not posted a discussion, yet`
    }
  }

  onScroll() {
    let { chatMode, feeds } = this.props
    const scrollPosition = document.getElementById('react-view').scrollTop
    if (!chatMode && feeds.length > 0) {
      this.setState({ scrollPosition })
      if (
        this.state.scrollPosition >=
        this.Container.offsetHeight - window.innerHeight - 500
      ) {
        this.loadMoreFeeds()
      }
    }
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
    contentFeedLike,
    fetchFeed,
    fetchUserFeeds,
    fetchMoreUserFeeds,
    clearFeeds,
    commentFeedLike,
    feedCommentDelete,
    feedContentDelete,
    feedCommentEdit,
    feedContentEdit,
    feedVideoStar,
    likeTargetComment,
    loadMoreFeedCommentsAsync,
    loadMoreFeedReplies,
    questionFeedLike,
    showFeedCommentsAsync,
    uploadFeedComment,
    uploadFeedReply,
    uploadTargetContentComment
  }
)(Body)
