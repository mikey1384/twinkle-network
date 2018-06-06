import React, { Component } from 'react'
import { Route } from 'react-router'
import {
  attachStar,
  commentFeedLike,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedContentEdit,
  feedRewardCommentEdit,
  feedVideoStar,
  fetchFeed,
  fetchUserFeeds,
  fetchMoreUserFeeds,
  likeTargetComment,
  clearFeeds,
  loadMoreFeedComments,
  loadMoreFeedReplies,
  questionFeedLike,
  showFeedComments,
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
import { queryStringForArray } from 'helpers/stringHelpers'
import FilterBar from 'components/FilterBar'

class Body extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    commentFeedLike: PropTypes.func.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    feeds: PropTypes.array,
    feedCommentDelete: PropTypes.func.isRequired,
    feedCommentEdit: PropTypes.func.isRequired,
    feedContentDelete: PropTypes.func.isRequired,
    feedContentEdit: PropTypes.func.isRequired,
    feedRewardCommentEdit: PropTypes.func.isRequired,
    feedVideoStar: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    fetchMoreUserFeeds: PropTypes.func.isRequired,
    fetchUserFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    likeTargetComment: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreFeedComments: PropTypes.func.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    questionFeedLike: PropTypes.func.isRequired,
    showFeedComments: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadFeedReply: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    myId: PropTypes.number
  }

  state = {
    currentTab: 'all',
    loading: false
  }

  componentDidMount() {
    const { match, location, clearFeeds } = this.props
    this.mounted = true
    addEvent(document.getElementById('App'), 'scroll', this.onScroll)
    clearFeeds()
    switch (location.pathname) {
      case match.url:
        return this.changeTab('all')
      case `${match.url}/posts`:
        return this.changeTab('post')
      case `${match.url}/comments`:
        return this.changeTab('comment')
      case `${match.url}/videos`:
        return this.changeTab('video')
      case `${match.url}/links`:
        return this.changeTab('url')
      default:
        break
    }
  }

  componentDidUpdate(prevProps) {
    const { match, location, clearFeeds } = this.props

    if (prevProps.location !== this.props.location) {
      clearFeeds()
      switch (location.pathname) {
        case match.url:
          return this.changeTab('all')
        case `${match.url}/posts`:
          return this.changeTab('post')
        case `${match.url}/comments`:
          return this.changeTab('comment')
        case `${match.url}/videos`:
          return this.changeTab('video')
        case `${match.url}/links`:
          return this.changeTab('url')
        default:
          break
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll)
  }

  render() {
    const {
      attachStar,
      commentFeedLike,
      contentFeedLike,
      match: route,
      match: {
        params: { username }
      },
      history,
      likeTargetComment,
      loadMoreFeedReplies,
      feeds,
      feedCommentDelete,
      feedCommentEdit,
      feedContentDelete,
      feedContentEdit,
      feedRewardCommentEdit,
      feedVideoStar,
      fetchFeed,
      loadMoreFeedComments,
      myId,
      loaded,
      loadMoreButton,
      clearFeeds,
      questionFeedLike,
      showFeedComments,
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
                      key={`${feed.type}${feed.id}`}
                      contentObj={feed}
                      userId={myId}
                      methodObj={{
                        attachStar,
                        deleteComment: feedCommentDelete,
                        deleteContent: feedContentDelete,
                        editComment: feedCommentEdit,
                        editContent: feedContentEdit,
                        editRewardComment: feedRewardCommentEdit,
                        likeComment: commentFeedLike,
                        likeContent: contentFeedLike,
                        likeQuestion: questionFeedLike,
                        likeTargetComment: likeTargetComment,
                        loadContent: fetchFeed,
                        loadMoreComments: loadMoreFeedComments,
                        loadMoreReplies: loadMoreFeedReplies,
                        showComments: showFeedComments,
                        starVideo: feedVideoStar,
                        uploadComment: uploadFeedComment,
                        uploadReply: uploadFeedReply,
                        uploadTargetComment: uploadTargetContentComment
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
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
            onClick={this.loadMoreFeeds}
            loading={loading}
          />
        )}
      </div>
    )
  }

  changeTab = tabName => {
    const {
      match: {
        params: { username }
      },
      fetchUserFeeds
    } = this.props
    if (this.mounted) {
      this.setState({ currentTab: tabName })
    }
    fetchUserFeeds({ username, type: tabName })
  }

  loadMoreFeeds = async() => {
    const {
      match: {
        params: { username }
      },
      fetchMoreUserFeeds,
      feeds
    } = this.props
    const { currentTab, loading } = this.state

    if (!loading) {
      this.setState({ loading: true })
      try {
        await fetchMoreUserFeeds({
          username,
          type: currentTab,
          shownFeeds: queryStringForArray(feeds, 'id', 'shownFeeds')
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
    const scrollPosition = document.getElementById('App').scrollTop
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
    attachStar,
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
    feedRewardCommentEdit,
    feedVideoStar,
    likeTargetComment,
    loadMoreFeedComments,
    loadMoreFeedReplies,
    questionFeedLike,
    showFeedComments,
    uploadFeedComment,
    uploadFeedReply,
    uploadTargetContentComment
  }
)(Body)
