import React, {Component , PropTypes} from 'react';
import {connect} from 'react-redux';
import Button from 'components/Button';
import FeedPanel from './FeedPanel';
import {fetchMoreFeedsAsync} from 'redux/actions/FeedActions';

@connect(
  state => ({
    feeds: state.FeedReducer.feeds,
    loadMoreButton: state.FeedReducer.loadMoreButton,
    userId: state.UserReducer.userId
  }),
  {fetchMoreFeeds: fetchMoreFeedsAsync}
)
export default class Home extends Component {
  constructor() {
    super()
    this.loadMoreFeeds = this.loadMoreFeeds.bind(this)
  }

  render() {
    const {userId, feeds, loadMoreButton} = this.props;
    return !!feeds && feeds.length > 0 ? (
      <div className="container-fluid">
        {feeds.map(feed => {
          return <FeedPanel key={feed.contentId} feed={feed} userId={userId} />;
        })}
        {loadMoreButton &&
          <div className="text-center" style={{paddingBottom: '1em'}}>
            <Button className="btn btn-warning" onClick={this.loadMoreFeeds}>Load More</Button>
          </div>
        }
      </div>
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
    console.log(feeds.length);
    fetchMoreFeeds(feeds.length);
  }
}
