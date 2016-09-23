import React, {Component , PropTypes} from 'react';
import {connect} from 'react-redux';
import Button from 'components/Button';
import FeedPanel from './FeedPanel';

@connect(
  state => ({
    feeds: state.FeedReducer.feeds,
    userId: state.UserReducer.userId
  })
)
export default class Home extends Component {
  render() {
    const {userId, feeds} = this.props;
    return !!feeds && feeds.length > 0 ? (
      <div className="container-fluid">
        {feeds.map(feed => {
          return <FeedPanel key={feed.contentId} feed={feed} userId={userId} />;
        })}
      </div>
    ) :
    <p style={{
      textAlign: 'center',
      paddingTop: '1em',
      paddingBottom: '1em',
      fontSize: '3em'
    }}><span className="glyphicon glyphicon-refresh spinning"></span> <span>Loading...</span></p>
  }
}
