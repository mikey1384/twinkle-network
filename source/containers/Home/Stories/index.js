import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {
  fetchMoreFeedsAsync,
  fetchFeedsAsync,
  fetchFeed,
  clearFeeds
} from 'redux/actions/FeedActions'
import InputPanel from './InputPanel'
import FeedPanel from '../FeedPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import {connect} from 'react-redux'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'
import ExecutionEnvironment from 'exenv'

class Stories extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    clearFeeds: PropTypes.func.isRequired,
    feeds: PropTypes.array.isRequired,
    fetchFeeds: PropTypes.func.isRequired,
    fetchMoreFeeds: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    selectedFilter: PropTypes.string.isRequired,
    userId: PropTypes.number
  }

  scrollHeight = 0

  constructor() {
    super()
    this.state = {
      clearingFeeds: false,
      loadingMore: false,
      scrollPosition: 0
    }
    this.applyFilter = this.applyFilter.bind(this)
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  componentWillMount() {
    let {history, clearFeeds, fetchFeeds, loaded} = this.props
    if (ExecutionEnvironment.canUseDOM) {
      addEvent(window, 'scroll', this.onScroll)
      if (history.action === 'PUSH' || !loaded) {
        this.setState({clearingFeeds: true})
        return clearFeeds().then(
          () => {
            this.setState({clearingFeeds: false})
            fetchFeeds()
          }
        )
      }
    }
  }

  componentWillUnmount() {
    removeEvent(window, 'scroll', this.onScroll)
  }

  render() {
    const {feeds, loadMoreButton, userId, loaded} = this.props
    const {clearingFeeds, loadingMore} = this.state

    return (
      <div>
        {this.renderFilterBar()}
        <InputPanel />
        {!loaded &&
          <Loading text="Loading Feeds..." />
        }
        {loaded && feeds.length === 0 &&
          <p style={{
            textAlign: 'center',
            paddingTop: '1em',
            paddingBottom: '1em',
            fontSize: '2em'
          }}>
            <span>Hello there!</span>
          </p>
        }
        {loaded && feeds.length > 0 &&
          <div>
            {feeds.map(feed => {
              return <FeedPanel key={`${feed.id}`} loadingDisabled={clearingFeeds} feed={feed} userId={userId} />
            })}
            {loadMoreButton && <LoadMoreButton onClick={this.loadMoreFeeds} loading={loadingMore} />}
          </div>
        }
      </div>
    )
  }

  applyFilter(filter) {
    const {fetchFeeds, selectedFilter, clearFeeds} = this.props
    if (filter === selectedFilter) return
    return clearFeeds().then(
      () => fetchFeeds(filter)
    )
  }

  loadMoreFeeds() {
    const {feeds, fetchMoreFeeds, selectedFilter} = this.props
    const {loadingMore} = this.state
    if (!loadingMore) {
      this.setState({loadingMore: true})
      fetchMoreFeeds(feeds[feeds.length - 1].id, selectedFilter).then(
        () => this.setState({loadingMore: false})
      )
    }
  }

  onScroll() {
    const {chatMode, feeds} = this.props
    if (document.body.scrollHeight > this.scrollHeight) {
      this.scrollHeight = document.body.scrollHeight
    }
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop
    if (!chatMode && feeds.length > 0 && this.scrollHeight !== 0) {
      this.setState(() => ({
        scrollPosition
      }), () => {
        if (this.state.scrollPosition >= this.scrollHeight - window.innerHeight - 500) {
          this.loadMoreFeeds()
        }
      })
    }
  }

  renderFilterBar() {
    const {selectedFilter} = this.props
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
    fetchMoreFeeds: fetchMoreFeedsAsync,
    fetchFeeds: fetchFeedsAsync,
    clearFeeds,
    fetchFeed
  }
)(Stories)
