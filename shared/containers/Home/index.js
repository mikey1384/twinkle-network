import React, {Component , PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchMoreFeedsAsync, fetchFeedsAsync} from 'redux/actions/FeedActions';
import Feeds from './Feeds';
import Profile from './Profile';
import {Color} from 'constants/css';

@connect(
  state => ({
    feeds: state.FeedReducer.feeds,
    loadMoreButton: state.FeedReducer.loadMoreButton,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    selectedFilter: state.FeedReducer.selectedFilter
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
      selectedTab: 'feed'
    }
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
    this.applyFilter = this.applyFilter.bind(this)
    this.renderFilterBar = this.renderFilterBar.bind(this)
  }

  render() {
    const {userId, feeds, loadMoreButton, username, selectedFilter} = this.props;
    const {selectedTab} = this.state;
    const defaultListStyle = {backgroundColor: Color.backgroundGray, border: 'none', cursor: 'pointer'};
    const listStyle = {
      profile: {
        ...defaultListStyle,
        backgroundColor: selectedTab === 'profile' ? Color.lightGray : defaultListStyle.backgroundColor,
        fontWeight: selectedTab === 'profile' && 'bold'
      },
      feed: {
        ...defaultListStyle,
        backgroundColor: selectedTab === 'feed' ? Color.lightGray : defaultListStyle.backgroundColor,
        fontWeight: selectedTab === 'feed' && 'bold'
      },
      people: {
        ...defaultListStyle,
        color: Color.gray,
        backgroundColor: selectedTab === 'people' ? Color.lightGray : defaultListStyle.backgroundColor,
        fontWeight: selectedTab === 'people' && 'bold'
      }
    };
    return (
      <div className="container">
        <div
          className="col-xs-2"
          style={{
            marginTop: '2em',
            position: 'fixed'
          }}
        >
          <ul className="list-group unselectable" style={{fontSize: '1.3em'}}>
            <li
              className="list-group-item"
              style={listStyle.profile}
              onClick={
                () => {
                  if (selectedTab !== 'profile') this.setState({selectedTab: 'profile'})
                }
              }
            >
              My Profile
            </li>
            <li
              className="list-group-item"
              style={listStyle.feed}
              onClick={
                () => {
                  if (selectedTab !== 'feed') this.setState({selectedTab: 'feed'})
                }
              }
            >
              News Feed
            </li>
            <li
              className="list-group-item"
              style={listStyle.people}
            >
              People
            </li>
          </ul>
        </div>
        <div className="col-xs-8 col-xs-offset-3">
          {selectedTab === 'feed' &&
            <Feeds
              feeds={feeds}
              loadMoreButton={loadMoreButton}
              userId={userId}
              loadMoreFeeds={this.loadMoreFeeds}
              renderFilterBar={this.renderFilterBar}
            />
          }
          {selectedTab === 'profile' &&
            <Profile />
          }
        </div>
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
    fetchMoreFeeds(feeds[feeds.length - 1].id, selectedFilter);
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
