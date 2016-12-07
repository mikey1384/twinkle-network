import React, {Component , PropTypes} from 'react';
import {connect} from 'react-redux';
import Button from 'components/Button';
import FeedPanel from './FeedPanel';
import {fetchMoreFeedsAsync} from 'redux/actions/FeedActions';
import FeedInputPanel from './FeedInputPanel';

@connect(
  state => ({
    feeds: state.FeedReducer.feeds,
    loadMoreButton: state.FeedReducer.loadMoreButton,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  {fetchMoreFeeds: fetchMoreFeedsAsync}
)
export default class Home extends Component {
  constructor() {
    super()
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
  }

  render() {
    const {userId, feeds, loadMoreButton, username} = this.props;
    return !!feeds ? (
      feeds.length > 0 ?
        <div className="container-fluid col-md-offset-3 col-md-6">
          {!!userId && <FeedInputPanel />}

          <nav className="navbar navbar-inverse">
            <ul className="nav nav-pills col-md-8" style={{margin: '0.5em'}}>
              <li className="active"><a style={{cursor: 'pointer'}}>All</a></li>
              <li><a style={{cursor: 'pointer'}}>Discussions</a></li>
              <li><a style={{cursor: 'pointer'}}>Videos</a></li>
              <li><a style={{cursor: 'pointer'}}>Links</a></li>
              <li><a style={{cursor: 'pointer'}}>Comments</a></li>
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

  loadMoreFeeds() {
    const {feeds, fetchMoreFeeds} = this.props;
    fetchMoreFeeds(feeds[feeds.length - 1].id);
  }
}
