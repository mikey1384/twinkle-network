import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import VideoThumbImage from 'components/VideoThumbImage';
import { Color } from 'constants/css';
import { cleanString } from 'helpers/stringHelpers';
import Link from 'components/Link';
import { loadPlaylistVideos } from 'helpers/requestHelpers';
import NotFound from 'components/NotFound';

export default class Playlist extends Component {
  static propTypes = {
    onLinkClick: PropTypes.func,
    onLoad: PropTypes.func,
    playlistId: PropTypes.number.isRequired
  };

  state = {
    videos: [],
    loadMoreButton: false,
    loading: false,
    loaded: false
  };

  async componentDidMount() {
    const { playlistId, onLoad } = this.props;
    const { title, results: videos, loadMoreButton } = await loadPlaylistVideos(
      {
        playlistId
      }
    );
    if (typeof onLoad === 'function') {
      onLoad({ exists: videos.length > 0, title });
    }
    this.setState({
      videos,
      loaded: true,
      loadMoreButton
    });
  }

  render() {
    const { onLinkClick = () => {}, playlistId } = this.props;
    const { videos, loaded, loading, loadMoreButton } = this.state;
    return (
      <>
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
              <Link
                onClick={onLinkClick}
                to={`/videos/${video.id}?playlist=${playlistId}`}
              >
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
                  color: video.byUser ? Color.orange() : Color.blue(),
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  lineHeight: 1.5
                }}
                onClick={onLinkClick}
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
        {loadMoreButton && (
          <LoadMoreButton
            style={{ marginTop: '1.5em' }}
            loading={loading}
            filled
            info
            onClick={this.onLoadMoreVideos}
          />
        )}
      </>
    );
  }

  onLoadMoreVideos = async() => {
    const { playlistId } = this.props;
    const { videos } = this.state;
    this.setState({ loading: true });
    const { results: loadedVideos, loadMoreButton } = await loadPlaylistVideos({
      playlistId,
      shownVideos: videos
    });
    this.setState({
      videos: videos.concat(loadedVideos),
      loadMoreButton,
      loading: false
    });
  };
}
