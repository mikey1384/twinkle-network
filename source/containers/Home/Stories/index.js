import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  attachStar,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentEdit,
  feedContentDelete,
  feedRewardCommentEdit,
  feedVideoStar,
  fetchMoreFeeds,
  fetchNewFeeds,
  fetchFeeds,
  fetchFeed,
  loadMoreFeedReplies,
  loadMoreFeedComments,
  clearFeeds,
  questionFeedLike,
  showFeedComments,
  uploadFeedComment,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import { resetNumNewPosts } from 'redux/actions/NotiActions'
import InputPanel from './InputPanel'
import ContentPanel from 'components/ContentPanel'
import LoadMoreButton from 'components/Buttons/LoadMoreButton'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import FilterBar from 'components/FilterBar'
import Banner from 'components/Banner'
import { queryStringForArray } from 'helpers/stringHelpers'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import { loadNewFeeds } from 'helpers/requestHelpers'

class Stories extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    feeds: PropTypes.array.isRequired,
    feedCommentDelete: PropTypes.func.isRequired,
    feedContentDelete: PropTypes.func.isRequired,
    feedContentEdit: PropTypes.func.isRequired,
    feedCommentEdit: PropTypes.func.isRequired,
    feedRewardCommentEdit: PropTypes.func.isRequired,
    feedVideoStar: PropTypes.func.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    fetchFeeds: PropTypes.func.isRequired,
    fetchMoreFeeds: PropTypes.func.isRequired,
    fetchNewFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreFeedComments: PropTypes.func.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    numNewPosts: PropTypes.number.isRequired,
    resetNumNewPosts: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    showFeedComments: PropTypes.func.isRequired,
    username: PropTypes.string,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    userId: PropTypes.number
  }

  clearingFeeds = false
  scrollHeight = 0

  state = {
    loadingMore: false
  }

  body =
    typeof document !== 'undefined'
      ? document.scrollingElement || document.documentElement
      : {}

  async componentDidMount() {
    let {
      history,
      clearFeeds,
      fetchFeeds,
      loaded,
      resetNumNewPosts
    } = this.props
    addEvent(window, 'scroll', this.onScroll)
    addEvent(document.getElementById('App'), 'scroll', this.onScroll)
    if (history.action === 'PUSH' || !loaded) {
      this.clearingFeeds = true
      clearFeeds()
      this.clearingFeeds = false
      fetchFeeds()
    }
    resetNumNewPosts()
  }

  componentWillUnmount() {
    removeEvent(window, 'scroll', this.onScroll)
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll)
  }

  render() {
    const {
      attachStar,
      contentFeedLike,
      feeds,
      feedCommentDelete,
      feedCommentEdit,
      feedContentDelete,
      feedContentEdit,
      feedVideoStar,
      feedRewardCommentEdit,
      fetchFeed,
      loadMoreButton,
      loadMoreFeedReplies,
      numNewPosts,
      userId,
      loaded,
      loadMoreFeedComments,
      showFeedComments,
      uploadTargetContentComment,
      username
    } = this.props
    const { loadingMore } = this.state
    return (
      <ErrorBoundary>
        <div
          ref={ref => {
            this.Container = ref
          }}
          style={{ position: 'relative', width: '100%', paddingBottom: '1rem' }}
        >
          {this.renderFilterBar()}
          <InputPanel />
          <div style={{ width: '100%' }}>
            {!loaded && <Loading text="Loading Feeds..." />}
            {loaded &&
              feeds.length === 0 && (
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
            {loaded &&
              feeds.length > 0 && (
                <Fragment>
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
                        selfLoadingDisabled={this.clearingFeeds}
                        userId={userId}
                      />
                    )
                  })}
                  {loadMoreButton && (
                    <LoadMoreButton
                      onClick={this.loadMoreFeeds}
                      loading={loadingMore}
                      filled
                      info
                    />
                  )}
                </Fragment>
              )}
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  applyFilter = filter => {
    const { fetchFeeds, selectedFilter, clearFeeds } = this.props
    if (filter === selectedFilter) return
    clearFeeds()
    fetchFeeds({ filter })
  }

  loadMoreFeeds = async() => {
    const { feeds, fetchMoreFeeds, selectedFilter } = this.props
    const { loadingMore } = this.state
    if (!loadingMore) {
      this.setState({ loadingMore: true })
      try {
        await fetchMoreFeeds({
          shownFeeds: queryStringForArray(feeds, 'feedId', 'shownFeeds'),
          filter: selectedFilter
        })
        this.setState({ loadingMore: false })
      } catch (error) {
        console.error(error)
      }
    }
  }

  onScroll = () => {
    const { chatMode, feeds, loadMoreButton } = this.props
    if (
      document.getElementById('App').scrollHeight > this.scrollHeight ||
      this.body.scrollTop > this.scrollHeight
    ) {
      this.scrollHeight = Math.max(
        document.getElementById('App').scrollHeight,
        this.body.scrollTop
      )
    }
    if (!chatMode && feeds.length > 0 && this.scrollHeight !== 0) {
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
            this.loadMoreFeeds()
          }
        }
      )
    }
  }

  fetchNewFeeds = async() => {
    const { feeds = [], resetNumNewPosts, fetchNewFeeds } = this.props
    const { loadingMore } = this.state
    if (!loadingMore) {
      this.setState({ loadingMore: true })
      resetNumNewPosts()
      const data = await loadNewFeeds({
        lastInteraction: feeds[0] ? feeds[0].lastInteraction : 0,
        shownFeeds: queryStringForArray(feeds, 'feedId', 'shownFeeds')
      })
      if (data) fetchNewFeeds(data)
      this.setState({ loadingMore: false })
    }
  }

  renderFilterBar = () => {
    const { selectedFilter } = this.props
    return (
      <FilterBar bordered>
        <nav
          className={selectedFilter === 'all' ? 'active' : ''}
          onClick={() => this.applyFilter('all')}
        >
          All
        </nav>
        <nav
          className={selectedFilter === 'post' ? 'active' : ''}
          onClick={() => this.applyFilter('post')}
        >
          Posts
        </nav>
        <nav
          className={selectedFilter === 'video' ? 'active' : ''}
          onClick={() => this.applyFilter('video')}
        >
          Videos
        </nav>
        <nav
          className={selectedFilter === 'url' ? 'active' : ''}
          onClick={() => this.applyFilter('url')}
        >
          Links
        </nav>
        <nav
          className={selectedFilter === 'comment' ? 'active' : ''}
          onClick={() => this.applyFilter('comment')}
        >
          Comments
        </nav>
      </FilterBar>
    )
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
    loadMoreButton: state.FeedReducer.loadMoreButton,
    feeds: state.FeedReducer.feeds,
    loaded: state.FeedReducer.loaded,
    numNewPosts: state.NotiReducer.numNewPosts,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    selectedFilter: state.FeedReducer.selectedFilter,
    chatMode: state.ChatReducer.chatMode,
    noFeeds: state.FeedReducer.noFeeds
  }),
  {
    attachStar,
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
    feedVideoStar,
    loadMoreFeedComments,
    loadMoreFeedReplies,
    clearFeeds,
    questionFeedLike,
    resetNumNewPosts,
    showFeedComments,
    uploadFeedComment,
    uploadTargetContentComment
  }
)(Stories)
