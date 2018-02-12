import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  commentFeedLike,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedVideoStar,
  fetchMoreFeedsAsync,
  fetchFeedsAsync,
  fetchFeed,
  likeTargetComment,
  loadMoreFeedReplies,
  loadMoreFeedCommentsAsync,
  clearFeeds,
  questionFeedLike,
  showFeedCommentsAsync,
  uploadFeedComment,
  uploadFeedReply,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import InputPanel from './InputPanel'
import ContentPanel from 'components/ContentPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import { feedContentEdit } from '../../../redux/actions/FeedActions'

const REACT_VIEW = document.getElementById('react-view')

class Stories extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    commentFeedLike: PropTypes.func.isRequired,
    feeds: PropTypes.array.isRequired,
    feedCommentDelete: PropTypes.func.isRequired,
    feedContentDelete: PropTypes.func.isRequired,
    feedContentEdit: PropTypes.func.isRequired,
    feedCommentEdit: PropTypes.func.isRequired,
    feedVideoStar: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    fetchFeeds: PropTypes.func.isRequired,
    fetchMoreFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    likeTargetComment: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreFeedCommentsAsync: PropTypes.func.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    questionFeedLike: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    showFeedCommentsAsync: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadFeedReply: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    userId: PropTypes.number
  }

  clearingFeeds = false
  scrollHeight = 0

  constructor() {
    super()
    this.state = {
      loadingMore: false,
      scrollPosition: 0
    }
    this.applyFilter = this.applyFilter.bind(this)
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  async componentDidMount() {
    let { history, clearFeeds, fetchFeeds, loaded } = this.props
    addEvent(REACT_VIEW, 'scroll', this.onScroll)
    if (history.action === 'PUSH' || !loaded) {
      this.clearingFeeds = true
      await clearFeeds()
      this.clearingFeeds = false
      fetchFeeds()
    }
  }

  componentWillUnmount() {
    removeEvent(REACT_VIEW, 'scroll', this.onScroll)
  }

  render() {
    const {
      contentFeedLike,
      commentFeedLike,
      feeds,
      feedCommentDelete,
      feedCommentEdit,
      feedContentDelete,
      feedContentEdit,
      feedVideoStar,
      fetchFeed,
      likeTargetComment,
      loadMoreButton,
      loadMoreFeedReplies,
      uploadFeedReply,
      userId,
      loaded,
      loadMoreFeedCommentsAsync,
      questionFeedLike,
      showFeedCommentsAsync,
      uploadFeedComment,
      uploadTargetContentComment
    } = this.props
    const { loadingMore } = this.state

    return (
      <div
        ref={ref => {
          this.Container = ref
        }}
        style={{ paddingBottom: '1rem' }}
      >
        {this.renderFilterBar()}
        <InputPanel />
        {!loaded && <Loading text="Loading Feeds..." />}
        {loaded &&
          feeds.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                paddingTop: '1em',
                paddingBottom: '1em',
                fontSize: '2em'
              }}
            >
              <span>Hello there!</span>
            </p>
          )}
        {loaded &&
          feeds.length > 0 && (
            <div>
              {feeds.map(feed => {
                return (
                  <ContentPanel
                    key={`${feed.id}`}
                    selfLoadingDisabled={this.clearingFeeds}
                    contentObj={feed}
                    methodObj={{
                      onFetchContent: fetchFeed,
                      onCommentSubmit: uploadFeedComment,
                      onReplySubmit: uploadFeedReply,
                      onTargetCommentSubmit: uploadTargetContentComment,
                      onLikeContent: contentFeedLike,
                      onLikeComment: commentFeedLike,
                      onLikeTargetComment: likeTargetComment,
                      onLikeQuestion: questionFeedLike,
                      onEditContent: feedContentEdit,
                      onDeleteContent: feedContentDelete,
                      onDeleteComment: feedCommentDelete,
                      onEditComment: feedCommentEdit,
                      onLoadMoreComments: loadMoreFeedCommentsAsync,
                      onLoadMoreReplies: loadMoreFeedReplies,
                      onShowComments: showFeedCommentsAsync,
                      onVideoStar: feedVideoStar
                    }}
                    userId={userId}
                  />
                )
              })}
              {loadMoreButton && (
                <LoadMoreButton
                  onClick={this.loadMoreFeeds}
                  loading={loadingMore}
                />
              )}
            </div>
          )}
      </div>
    )
  }

  applyFilter(filter) {
    const { fetchFeeds, selectedFilter, clearFeeds } = this.props
    if (filter === selectedFilter) return
    return clearFeeds().then(() => fetchFeeds(filter))
  }

  loadMoreFeeds() {
    const { feeds, fetchMoreFeeds, selectedFilter } = this.props
    const { loadingMore } = this.state
    if (!loadingMore) {
      this.setState({ loadingMore: true })
      fetchMoreFeeds(feeds[feeds.length - 1].id, selectedFilter).then(() =>
        this.setState({ loadingMore: false })
      )
    }
  }

  onScroll() {
    const { chatMode, feeds } = this.props
    if (REACT_VIEW.scrollHeight > this.scrollHeight) {
      this.scrollHeight = REACT_VIEW.scrollHeight
    }
    if (!chatMode && feeds.length > 0 && this.scrollHeight !== 0) {
      this.setState(
        {
          scrollPosition: REACT_VIEW.scrollTop
        },
        () => {
          if (
            this.state.scrollPosition >=
            this.Container.offsetHeight - window.innerHeight - 500
          ) {
            this.loadMoreFeeds()
          }
        }
      )
    }
  }

  renderFilterBar() {
    const { selectedFilter } = this.props
    return (
      <nav className="navbar navbar-inverse">
        <ul
          className="nav nav-pills"
          style={{
            margin: '0.5em',
            fontSize: '1.2em',
            fontWeight: 'bold'
          }}
        >
          <li className={selectedFilter === 'all' ? 'active' : ''}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('all')}
            >
              All
            </a>
          </li>
          <li className={selectedFilter === 'question' ? 'active' : ''}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('question')}
            >
              Questions
            </a>
          </li>
          <li className={selectedFilter === 'discussion' ? 'active' : ''}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('discussion')}
            >
              Discussions
            </a>
          </li>
          <li className={selectedFilter === 'video' ? 'active' : ''}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('video')}
            >
              Videos
            </a>
          </li>
          <li className={selectedFilter === 'url' ? 'active' : ''}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('url')}
            >
              Links
            </a>
          </li>
          <li className={selectedFilter === 'comment' ? 'active' : ''}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('comment')}
            >
              Comments
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default connect(
  state => ({
    loadMoreButton: state.FeedReducer.loadMoreButton,
    feeds: state.FeedReducer.feeds,
    loaded: state.FeedReducer.loaded,
    userId: state.UserReducer.userId,
    selectedFilter: state.FeedReducer.selectedFilter,
    chatMode: state.ChatReducer.chatMode,
    noFeeds: state.FeedReducer.noFeeds
  }),
  {
    contentFeedLike,
    commentFeedLike,
    fetchMoreFeeds: fetchMoreFeedsAsync,
    fetchFeed,
    fetchFeeds: fetchFeedsAsync,
    feedCommentDelete,
    feedContentDelete,
    feedContentEdit,
    feedCommentEdit,
    feedVideoStar,
    likeTargetComment,
    loadMoreFeedCommentsAsync,
    loadMoreFeedReplies,
    clearFeeds,
    questionFeedLike,
    showFeedCommentsAsync,
    uploadFeedComment,
    uploadFeedReply,
    uploadTargetContentComment
  }
)(Stories)
