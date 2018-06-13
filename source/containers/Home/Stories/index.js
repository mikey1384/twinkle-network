import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  attachStar,
  commentFeedLike,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedRewardCommentEdit,
  feedVideoStar,
  fetchMoreFeeds,
  fetchNewFeeds,
  fetchFeeds,
  fetchFeed,
  likeTargetComment,
  loadMoreFeedReplies,
  loadMoreFeedComments,
  clearFeeds,
  questionFeedLike,
  showFeedComments,
  uploadFeedComment,
  uploadFeedReply,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import { resetNumNewPosts } from 'redux/actions/NotiActions'
import InputPanel from './InputPanel'
import ContentPanel from 'components/ContentPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { addEvent, removeEvent } from 'helpers/listenerHelpers'
import { feedContentEdit } from '../../../redux/actions/FeedActions'
import FilterBar from 'components/FilterBar'
import Banner from 'components/Banner'
import { queryStringForArray } from 'helpers/stringHelpers'

class Stories extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    contentFeedLike: PropTypes.func.isRequired,
    commentFeedLike: PropTypes.func.isRequired,
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
    likeTargetComment: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    loadMoreFeedComments: PropTypes.func.isRequired,
    loadMoreFeedReplies: PropTypes.func.isRequired,
    numNewPosts: PropTypes.number.isRequired,
    questionFeedLike: PropTypes.func.isRequired,
    resetNumNewPosts: PropTypes.func.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    showFeedComments: PropTypes.func.isRequired,
    username: PropTypes.string,
    uploadFeedComment: PropTypes.func.isRequired,
    uploadFeedReply: PropTypes.func.isRequired,
    uploadTargetContentComment: PropTypes.func.isRequired,
    userId: PropTypes.number
  }

  clearingFeeds = false
  scrollHeight = 0

  state = {
    loadingMore: false,
    scrollPosition: 0
  }

  async componentDidMount() {
    let {
      history,
      clearFeeds,
      fetchFeeds,
      loaded,
      resetNumNewPosts
    } = this.props
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
    removeEvent(document.getElementById('App'), 'scroll', this.onScroll)
  }

  render() {
    const {
      attachStar,
      contentFeedLike,
      commentFeedLike,
      feeds,
      feedCommentDelete,
      feedCommentEdit,
      feedContentDelete,
      feedContentEdit,
      feedVideoStar,
      feedRewardCommentEdit,
      fetchFeed,
      likeTargetComment,
      loadMoreButton,
      loadMoreFeedReplies,
      numNewPosts,
      uploadFeedReply,
      userId,
      loaded,
      loadMoreFeedComments,
      questionFeedLike,
      showFeedComments,
      uploadFeedComment,
      uploadTargetContentComment,
      username
    } = this.props
    const { loadingMore } = this.state
    return (
      <div
        ref={ref => {
          this.Container = ref
        }}
        style={{ position: 'relative', paddingBottom: '1rem' }}
      >
        {this.renderFilterBar()}
        <InputPanel />
        <div>
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
                    info
                    onClick={this.fetchNewFeeds}
                    style={{ marginBottom: '1rem' }}
                  >
                    Click to See {numNewPosts} new Post{numNewPosts > 1
                      ? 's'
                      : ''}
                  </Banner>
                )}
                {feeds.map(feed => {
                  return (
                    <ContentPanel
                      key={feed.id}
                      selfLoadingDisabled={this.clearingFeeds}
                      inputAtBottom={feed.type === 'comment'}
                      contentObj={feed}
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
              </Fragment>
            )}
        </div>
      </div>
    )
  }

  applyFilter = filter => {
    const { fetchFeeds, selectedFilter, clearFeeds } = this.props
    if (filter === selectedFilter) return
    clearFeeds()
    fetchFeeds(filter)
  }

  loadMoreFeeds = async() => {
    const { feeds, fetchMoreFeeds, selectedFilter } = this.props
    const { loadingMore } = this.state
    if (!loadingMore) {
      this.setState({ loadingMore: true })
      try {
        await fetchMoreFeeds({
          shownFeeds: queryStringForArray(feeds, 'id', 'shownFeeds'),
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
    if (document.getElementById('App').scrollHeight > this.scrollHeight) {
      this.scrollHeight = document.getElementById('App').scrollHeight
    }
    if (!chatMode && feeds.length > 0 && this.scrollHeight !== 0) {
      this.setState(
        {
          scrollPosition: document.getElementById('App').scrollTop
        },
        () => {
          if (
            this.state.scrollPosition >=
              this.Container.offsetHeight - window.innerHeight - 400 &&
            loadMoreButton
          ) {
            this.loadMoreFeeds()
          }
        }
      )
    }
  }

  fetchNewFeeds = async() => {
    const { feeds, resetNumNewPosts, fetchNewFeeds, userId } = this.props
    const { loadingMore } = this.state
    if (!loadingMore) {
      this.setState({ loadingMore: true })
      resetNumNewPosts()
      const filteredFeeds = feeds.filter(feed => feed.uploaderId !== userId)
      const latestTS = filteredFeeds[0].lastInteraction
      await fetchNewFeeds({
        latestTS,
        userId,
        shownFeeds: queryStringForArray(
          feeds.filter(feed => feed.lastInteraction >= latestTS),
          'id',
          'shownFeeds'
        )
      })
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
    commentFeedLike,
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
    likeTargetComment,
    loadMoreFeedComments,
    loadMoreFeedReplies,
    clearFeeds,
    questionFeedLike,
    resetNumNewPosts,
    showFeedComments,
    uploadFeedComment,
    uploadFeedReply,
    uploadTargetContentComment
  }
)(Stories)
