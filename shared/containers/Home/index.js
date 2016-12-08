import React, {Component , PropTypes} from 'react';
import {connect} from 'react-redux';
import Button from 'components/Button';
import FeedPanel from './FeedPanel';
import {fetchMoreFeedsAsync, fetchFeedsAsync} from 'redux/actions/FeedActions';
import FeedInputPanel from './FeedInputPanel';

@connect(
  state => ({
    feeds: state.FeedReducer.feeds,
    loadMoreButton: state.FeedReducer.loadMoreButton,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  {
    fetchMoreFeeds: fetchMoreFeedsAsync,
    fetchFeeds: fetchFeedsAsync
  }
)
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      selectedFilter: 'all'
    }
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
  }

  render() {
    const {userId, feeds, loadMoreButton, username} = this.props;
    const {selectedFilter} = this.state;
    return !!feeds ? (
      feeds.length > 0 ?
        <div className="container-fluid col-md-offset-3 col-md-6">
          {!!userId && <FeedInputPanel />}

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

          {feeds.map(feed => {
            return <FeedPanel key={`${feed.id}`} feed={feed} userId={userId} />;
          })}
          {loadMoreButton &&
            <div className="text-center" style={{paddingBottom: '1em'}}>
              <Button className="btn btn-success" onClick={this.loadMoreFeeds}>Load More</Button>
            </div>
          }
        </div>
      : <p style={{
        textAlign: 'center',
        paddingTop: '1em',
        paddingBottom: '1em',
        fontSize: '2em'
      }}><span>Hello!</span></p>
    ) :
    <p style={{
      textAlign: 'center',
      paddingTop: '1em',
      paddingBottom: '1em',
      fontSize: '3em'
    }}><span className="glyphicon glyphicon-refresh spinning"></span> <span>Loading...</span></p>
  }

  applyFilter(filter) {
    const {selectedFilter} = this.state;
    const {fetchFeeds} = this.props;
    if (filter === selectedFilter) return;
    fetchFeeds(filter, () => {
      this.setState({selectedFilter: filter})
    })
  }

  loadMoreFeeds() {
    const {feeds, fetchMoreFeeds} = this.props;
    fetchMoreFeeds(feeds[feeds.length - 1].id);
  }
}
