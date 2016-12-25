import React, {Component} from 'react';
import {fetchMoreFeedsAsync, fetchFeedsAsync} from 'redux/actions/FeedActions';
import FeedInputPanel from './FeedInputPanel';
import FeedPanel from './FeedPanel';
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading';
import ExecutionEnvironment from 'exenv';
import {connect} from 'react-redux';


@connect(
  state => ({
    loadMoreButton: state.FeedReducer.loadMoreButton,
    feeds: state.FeedReducer.feeds,
    userId: state.UserReducer.userId,
    selectedFilter: state.FeedReducer.selectedFilter
  }),
  {
    fetchMoreFeeds: fetchMoreFeedsAsync,
    fetchFeeds: fetchFeedsAsync
  }
)
export default class Feeds extends Component {
  constructor() {
    super()
    this.state = {
      loadingMore: false
    }
    this.applyFilter = this.applyFilter.bind(this)
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
  }

  componentDidMount() {
    const {fetchFeeds, location, feeds} = this.props;
    if (ExecutionEnvironment.canUseDOM && (location.action === 'PUSH' || !feeds)) fetchFeeds();
  }

  render() {
    const {feeds, loadMoreButton, userId} = this.props;
    const {loadingMore} = this.state;
    return (
      <div>
        {!feeds &&
          <Loading text="Loading Feeds..." />
        }
        {!!feeds && feeds.length > 0 &&
          <div>
            <FeedInputPanel />
            {this.renderFilterBar()}
            {feeds.map(feed => {
              return <FeedPanel key={`${feed.id}`} feed={feed} userId={userId} />;
            })}
            {loadMoreButton && <LoadMoreButton onClick={this.loadMoreFeeds} loading={loadingMore} />}
          </div>
        }
        {!!feeds && feeds.length === 0 &&
          <p style={{
            textAlign: 'center',
            paddingTop: '1em',
            paddingBottom: '1em',
            fontSize: '2em'
          }}>
            <span>Hello!</span>
          </p>
        }
      </div>
    )
  }

  applyFilter(filter) {
    const {fetchFeeds, selectedFilter} = this.props;
    if (filter === selectedFilter) return;
    fetchFeeds(filter)
  }

  loadMoreFeeds() {
    const {feeds, fetchMoreFeeds, selectedFilter} = this.props;
    this.setState({loadingMore: true})
    fetchMoreFeeds(feeds[feeds.length - 1].id, selectedFilter, () => {
      this.setState({loadingMore: false})
    });
  }

  renderFilterBar() {
    const {selectedFilter} = this.props;
    return (
      <nav className="navbar navbar-inverse">
        <ul className="nav nav-pills col-md-8" style={{margin: '0.5em'}}>
          <li className={selectedFilter === 'all' && 'active'}>
            <a
              style={{
                cursor: 'pointer',
              }}
              onClick={() => this.applyFilter('all')}
            >
              All
            </a>
          </li>
          <li className={selectedFilter === 'discussion' && 'active'}>
            <a
              style={{
                cursor: 'pointer',
              }}
              onClick={() => this.applyFilter('discussion')}
            >
              Discussions
            </a>
          </li>
          <li className={selectedFilter === 'video' && 'active'}>
            <a
              style={{
                cursor: 'pointer',
              }}
              onClick={() => this.applyFilter('video')}
            >
              Videos
            </a>
          </li>
          <li className={selectedFilter === 'url' && 'active'}>
            <a
              style={{
                cursor: 'pointer',
              }}
              onClick={() => this.applyFilter('url')}
            >
              Links
            </a>
          </li>
          <li className={selectedFilter === 'comment' && 'active'}>
            <a
              style={{
                cursor: 'pointer',
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
