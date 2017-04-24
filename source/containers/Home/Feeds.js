import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {fetchMoreFeedsAsync, fetchFeedsAsync, fetchFeed, clearFeeds} from 'redux/actions/FeedActions'
import FeedInputPanel from './FeedInputPanel'
import FeedPanel from './FeedPanel'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import ExecutionEnvironment from 'exenv'
import {connect} from 'react-redux'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'

@connect(
  state => ({
    loadMoreButton: state.FeedReducer.loadMoreButton,
    feeds: state.FeedReducer.feeds,
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
)
export default class Feeds extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    noFeeds: PropTypes.bool,
    fetchFeeds: PropTypes.func,
    clearFeeds: PropTypes.func,
    history: PropTypes.object,
    feeds: PropTypes.array,
    loadMoreButton: PropTypes.bool,
    userId: PropTypes.number,
    selectedFilter: PropTypes.string,
    fetchMoreFeeds: PropTypes.func
  }

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

  componentDidMount() {
    const {fetchFeeds, history, feeds} = this.props
    if (ExecutionEnvironment.canUseDOM && (history.action === 'PUSH' || !feeds)) fetchFeeds()
    addEvent(window, 'scroll', this.onScroll)
  }

  componentWillUnmount() {
    this.props.clearFeeds()
    removeEvent(window, 'scroll', this.onScroll)
  }

  render() {
    const {feeds, noFeeds, loadMoreButton, userId} = this.props
    const {loadingMore} = this.state

    return (
      <div>
        <FeedInputPanel />
        {this.renderFilterBar()}
        {!feeds &&
          <Loading text="Loading Feeds..." />
        }
        {noFeeds &&
          <p style={{
            textAlign: 'center',
            paddingTop: '1em',
            paddingBottom: '1em',
            fontSize: '2em'
          }}>
            <span>Hello!</span>
          </p>
        }
        {!!feeds && feeds.length > 0 &&
          <div>
            {feeds.map(feed => {
              return <FeedPanel key={`${feed.id}`} feed={feed} userId={userId} />
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
    clearFeeds()
    fetchFeeds(filter)
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
    if (!chatMode && feeds.length > 0) {
      this.setState({scrollPosition: document.body.scrollTop})
      if (this.state.scrollPosition >= (document.body.scrollHeight - window.innerHeight) * 0.7) {
        this.loadMoreFeeds()
      }
    }
  }

  renderFilterBar() {
    const {selectedFilter} = this.props
    return (
      <nav className="navbar navbar-inverse">
        <ul className="nav nav-pills col-md-8" style={{margin: '0.5em'}}>
          <li className={selectedFilter === 'all' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('all')}
            >
              All
            </a>
          </li>
          <li className={selectedFilter === 'discussion' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('discussion')}
            >
              Discussions
            </a>
          </li>
          <li className={selectedFilter === 'video' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('video')}
            >
              Videos
            </a>
          </li>
          <li className={selectedFilter === 'url' && 'active'}>
            <a
              style={{
                cursor: 'pointer'
              }}
              onClick={() => this.applyFilter('url')}
            >
              Links
            </a>
          </li>
          <li className={selectedFilter === 'comment' && 'active'}>
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
