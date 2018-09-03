import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import VideoThumbImage from 'components/VideoThumbImage';
import { Color } from 'constants/css';
import { cleanString, queryStringForArray } from 'helpers/stringHelpers';
import { Link } from 'react-router-dom';
import request from 'axios';
import { URL } from 'constants/URL';
import NotFound from 'components/NotFound';

const API_URL = `${URL}/playlist`;

export default class Playlist extends Component {
  static propTypes = {
    onLoad: PropTypes.func,
    playlistId: PropTypes.number.isRequired
  };

  state = {
    videos: [],
    loadMoreButtonShown: false,
    loading: false,
    loaded: false
  };

  async componentDidMount() {
    const { playlistId, onLoad } = this.props;
    try {
      const {
        data: { videos, title }
      } = await request.get(`${API_URL}/playlist?playlistId=${playlistId}`);
      let loadMoreButtonShown = false;
      if (videos.length > 20) {
        videos.pop();
        loadMoreButtonShown = true;
      }
      if (typeof onLoad === 'function') {
        onLoad({ exists: videos.length > 0, title });
      }
      this.setState({
        videos,
        loaded: true,
        loadMoreButtonShown
      });
    } catch (error) {
      console.error(error.response || error);
    }
  }

  render() {
    const { playlistId } = this.props;
    const { videos, loaded, loading, loadMoreButtonShown } = this.state;
    return (
      <Fragment>
        {videos.length === 0 ? (
          loaded ? (
            <NotFound
              title="Playlist does not exist"
              text="It is either removed or never existed in the first place"
            />
          ) : (
            <Loading text="Loading..." />
          )
        ) : null}
        {videos.map((video, index) => (
          <div
            key={video.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              marginTop: index !== 0 ? '1rem' : 0
            }}
          >
            <div style={{ width: '35%' }}>
              <Link to={`/videos/${video.id}?playlist=${playlistId}`}>
                <VideoThumbImage
                  isStarred={!!video.isStarred}
                  videoId={video.id}
                  src={`https://img.youtube.com/vi/${
                    video.content
                  }/mqdefault.jpg`}
                />
              </Link>
            </div>
            <div style={{ width: '60%' }}>
              <Link
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  lineHeight: 1.5
                }}
                to={`/videos/${video.id}?playlist=${playlistId}`}
              >
                {cleanString(video.title)}
              </Link>
              <p style={{ color: Color.gray(), fontSize: '1.5rem' }}>
                Uploaded by {video.uploaderName}
              </p>
            </div>
          </div>
        ))}
        {loadMoreButtonShown && (
          <LoadMoreButton
            style={{ marginTop: '1.5em' }}
            loading={loading}
            filled
            info
            onClick={this.onLoadMoreVideos}
          />
        )}
      </Fragment>
    );
  }

  onLoadMoreVideos = async() => {
    const { playlistId } = this.props;
    const { videos } = this.state;
    this.setState({ loading: true });
    try {
      const {
        data: { videos: loadedVideos }
      } = await request.get(
        `${API_URL}/playlist?playlistId=${playlistId}&${queryStringForArray(
          videos,
          'id',
          'shownVideos'
        )}`
      );
      let loadMoreButtonShown = false;
      if (loadedVideos.length > 20) {
        loadedVideos.pop();
        loadMoreButtonShown = true;
      }
      this.setState({
        videos: videos.concat(loadedVideos),
        loadMoreButtonShown,
        loading: false
      });
    } catch (error) {
      console.error(error.response || error);
    }
  };
}
