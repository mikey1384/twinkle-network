import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  loadRightMenuVideos,
  loadMorePlaylistVideos
} from 'redux/actions/VideoActions';
import {
  clearNotifications,
  fetchNotifications
} from 'redux/actions/NotiActions';
import Link from 'components/Link';
import { Color, mobileMaxWidth } from 'constants/css';
import { cleanString, queryStringForArray } from 'helpers/stringHelpers';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import VideoThumbImage from 'components/VideoThumbImage';
import FilterBar from 'components/FilterBar';
import Notification from 'components/Notification';
import { socket } from 'constants/io';
import { css } from 'emotion';

class NavMenu extends Component {
  static propTypes = {
    loadMorePlaylistVideos: PropTypes.func.isRequired,
    loadRightMenuVideos: PropTypes.func.isRequired,
    nextVideos: PropTypes.array,
    numNewNotis: PropTypes.number,
    otherVideos: PropTypes.array,
    playlistId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    playlistTitle: PropTypes.string,
    playlistVideos: PropTypes.array,
    playlistVideosLoadMoreShown: PropTypes.bool,
    relatedVideos: PropTypes.array,
    totalRewardAmount: PropTypes.number,
    userId: PropTypes.number,
    videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired
  };

  state = {
    rewardsExist: false,
    playlistVideosLoading: false,
    videoTabActive: true
  };

  async componentDidMount() {
    const {
      loadRightMenuVideos,
      fetchNotifications,
      videoId,
      playlistId
    } = this.props;
    loadRightMenuVideos(videoId, playlistId);
    await fetchNotifications();
    socket.on('new_reward', this.notifyNewReward);
  }

  async componentDidUpdate(prevProps) {
    const {
      clearNotifications,
      fetchNotifications,
      loadRightMenuVideos,
      nextVideos,
      videoId,
      playlistId,
      totalRewardAmount
    } = this.props;
    if (!nextVideos || (videoId && prevProps.videoId !== videoId)) {
      loadRightMenuVideos(videoId, playlistId);
    }
    if (prevProps.totalRewardAmount !== totalRewardAmount) {
      this.setState({ rewardsExist: totalRewardAmount > 0 });
    }
    if (prevProps.userId !== this.props.userId) {
      if (!this.props.userId) {
        clearNotifications();
      } else {
        fetchNotifications();
      }
    }
  }

  componentWillUnmount() {
    socket.removeListener('new_reward', this.notifyNewReward);
  }

  render() {
    const {
      numNewNotis,
      nextVideos = [],
      relatedVideos = [],
      otherVideos = [],
      playlistId,
      playlistVideos = [],
      playlistTitle,
      playlistVideosLoadMoreShown,
      videoId
    } = this.props;
    const { rewardsExist, videoTabActive } = this.state;
    const { playlistVideosLoading } = this.state;
    return (
      <ErrorBoundary
        className={css`
          width: CALC(30% - 2rem);
          font-size: 2rem;
          margin-right: 1rem;
          > section {
            padding: 1rem;
            background: #fff;
            margin-bottom: 1rem;
            p {
              margin-bottom: 1rem;
              font-size: 2.5rem;
              font-weight: bold;
            }
            a {
              font-size: 1.7rem;
              font-weight: bold;
              line-height: 1.7rem;
            }
          }
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin: 0;
            section {
              margin: 0;
            }
          }
        `}
      >
        <FilterBar className="desktop">
          <nav
            className={videoTabActive ? 'active' : ''}
            onClick={() => this.setState({ videoTabActive: true })}
          >
            Videos
          </nav>
          <nav
            className={`${!videoTabActive ? 'active' : ''} ${
              rewardsExist || numNewNotis > 0 ? 'alert' : ''
            }`}
            onClick={() => this.setState({ videoTabActive: false })}
          >
            {rewardsExist ? 'Rewards' : 'Notifications'}
          </nav>
        </FilterBar>
        {videoTabActive && (
          <Fragment>
            {nextVideos.length > 0 && (
              <section key={videoId + 'up next'}>
                <p>Up Next</p>
                {this.renderVideos({
                  videos: nextVideos,
                  arePlaylistVideos: playlistId && playlistVideos.length > 0
                })}
              </section>
            )}
            {playlistId &&
              playlistVideos.length > 0 && (
                <section
                  key={videoId + 'playlist videos'}
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <Link
                      style={{
                        fontSize: '2.5rem',
                        textDecoration: 'none'
                      }}
                      to={`/playlists/${playlistId}`}
                    >
                      {cleanString(playlistTitle)}
                    </Link>
                  </div>
                  {this.renderVideos({
                    videos: playlistVideos,
                    arePlaylistVideos: true
                  })}
                  {playlistVideosLoadMoreShown && (
                    <LoadMoreButton
                      loading={playlistVideosLoading}
                      onClick={this.loadMorePlaylistVideos}
                      success
                      filled
                      style={{ marginTop: '1.5rem', width: '100%' }}
                    />
                  )}
                </section>
              )}
            {relatedVideos.length > 0 && (
              <section key={videoId + 'related videos'}>
                <p>Related Videos</p>
                {this.renderVideos({ videos: relatedVideos })}
              </section>
            )}
            {otherVideos.length > 0 && (
              <section key={videoId + 'new videos'}>
                <p>New Videos</p>
                {this.renderVideos({ videos: otherVideos })}
              </section>
            )}
          </Fragment>
        )}
        {!videoTabActive && <Notification style={{ paddingTop: 0 }} />}
      </ErrorBoundary>
    );
  }

  loadMorePlaylistVideos = async() => {
    const {
      loadMorePlaylistVideos,
      playlistId,
      playlistVideos,
      videoId
    } = this.props;
    this.setState({ playlistVideosLoading: true });
    await loadMorePlaylistVideos(
      videoId,
      playlistId,
      queryStringForArray(playlistVideos, 'videoId', 'shownVideos')
    );
    this.setState({ playlistVideosLoading: false });
  };

  notifyNewReward = async() => {
    const { fetchNotifications } = this.props;
    fetchNotifications();
  };

  renderVideos = ({ videos, arePlaylistVideos }) => {
    const { playlistId } = this.props;
    return videos.map((video, index) => (
      <div
        key={video.id}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          width: '100%',
          marginTop: index !== 0 ? '1rem' : 0
        }}
      >
        <div style={{ width: '50%' }}>
          <Link
            to={`/videos/${video.videoId}${
              arePlaylistVideos ? `?playlist=${playlistId}` : ''
            }`}
          >
            <VideoThumbImage
              isStarred={!!video.isStarred}
              videoId={video.videoId}
              src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
            />
          </Link>
        </div>
        <div
          style={{
            paddingLeft: '1rem',
            width: '50%',
            lineHeight: 1.1,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            marginTop: '-0.5rem'
          }}
        >
          <Link
            to={`/videos/${video.videoId}${
              arePlaylistVideos ? `?playlist=${playlistId}` : ''
            }`}
          >
            {cleanString(video.title)}
          </Link>
          <small
            style={{
              color: Color.gray(),
              display: 'block',
              fontSize: '1.3rem',
              marginTop: '1rem'
            }}
          >
            Uploaded by {video.username}
          </small>
        </div>
      </div>
    ));
  };
}

export default connect(
  state => ({
    nextVideos: state.VideoReducer.videoPage.nextVideos,
    numNewNotis: state.NotiReducer.numNewNotis,
    relatedVideos: state.VideoReducer.videoPage.relatedVideos,
    otherVideos: state.VideoReducer.videoPage.otherVideos,
    playlistVideos: state.VideoReducer.videoPage.playlistVideos,
    playlistVideosLoadMoreShown:
      state.VideoReducer.videoPage.playlistVideosLoadMoreShown,
    playlistTitle: state.VideoReducer.videoPage.playlistTitle,
    totalRewardAmount: state.NotiReducer.totalRewardAmount,
    userId: state.UserReducer.userId
  }),
  {
    clearNotifications,
    loadMorePlaylistVideos,
    loadRightMenuVideos,
    fetchNotifications
  }
)(NavMenu);
