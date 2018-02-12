import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  loadRightMenuVideos,
  loadMorePlaylistVideos
} from 'redux/actions/VideoActions'
import { Link } from 'react-router-dom'
import { Color } from 'constants/css'
import { cleanString } from 'helpers/stringHelpers'
import { queryStringForArray } from 'helpers/apiHelpers'
import FlatLoadMoreButton from 'components/LoadMoreButton/Flat'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import VideoThumbImage from 'components/VideoThumbImage'

class RightMenu extends Component {
  static propTypes = {
    loadMorePlaylistVideos: PropTypes.func.isRequired,
    loadRightMenuVideos: PropTypes.func.isRequired,
    nextVideos: PropTypes.array,
    otherVideos: PropTypes.array,
    playlistId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    playlistTitle: PropTypes.string,
    playlistVideos: PropTypes.array,
    playlistVideosLoadMoreShown: PropTypes.bool,
    relatedVideos: PropTypes.array,
    videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired
  }

  constructor() {
    super()
    this.state = {
      playlistVideosLoading: false
    }
    this.loadMorePlaylistVideos = this.loadMorePlaylistVideos.bind(this)
    this.renderVideos = this.renderVideos.bind(this)
  }

  componentDidMount() {
    const { loadRightMenuVideos, videoId, playlistId } = this.props
    loadRightMenuVideos(videoId, playlistId)
  }

  componentDidUpdate(prevProps) {
    const { loadRightMenuVideos, nextVideos, videoId, playlistId } = this.props
    if (!nextVideos || (videoId && prevProps.videoId !== videoId)) {
      loadRightMenuVideos(videoId, playlistId)
    }
  }

  render() {
    const {
      nextVideos = [],
      relatedVideos = [],
      otherVideos = [],
      playlistVideos = [],
      playlistTitle,
      playlistVideosLoadMoreShown
    } = this.props
    const { playlistVideosLoading } = this.state
    const noVideos =
      nextVideos.length +
        relatedVideos.length +
        otherVideos.length +
        playlistVideos.length ===
      0
    return (
      <ErrorBoundary
        css={`
          width: CALC(30% - 2rem);
          padding: 2rem;
          margin-right: 1rem;
        `}
        style={{ backgroundColor: !noVideos && '#fff' }}
      >
        {
          <div
            css={`
              h3:first-child {
                margin-top: 0px;
              }
            `}
          >
            {nextVideos.length > 0 && <h3>Up Next</h3>}
            {this.renderVideos(nextVideos)}
            {playlistVideos.length > 0 && <h3>{cleanString(playlistTitle)}</h3>}
            {this.renderVideos(playlistVideos)}
            {playlistVideosLoadMoreShown && (
              <FlatLoadMoreButton
                isLoading={playlistVideosLoading}
                onClick={this.loadMorePlaylistVideos}
                style={{ marginTop: '1.5em' }}
              />
            )}
            {relatedVideos.length > 0 && <h3>Related Videos</h3>}
            {this.renderVideos(relatedVideos)}
            {otherVideos.length > 0 && <h3>Recent Videos</h3>}
            {this.renderVideos(otherVideos)}
          </div>
        }
      </ErrorBoundary>
    )
  }

  loadMorePlaylistVideos() {
    const {
      loadMorePlaylistVideos,
      playlistId,
      playlistVideos,
      videoId
    } = this.props
    this.setState({ playlistVideosLoading: true })
    return loadMorePlaylistVideos(
      videoId,
      playlistId,
      queryStringForArray(playlistVideos, 'videoId', 'shownVideos')
    ).then(() => this.setState({ playlistVideosLoading: false }))
  }

  renderVideos(videos) {
    const { playlistId } = this.props
    return videos.map((video, index) => (
      <div
        key={video.id}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
          marginTop: index !== 0 ? '1rem' : 0
        }}
      >
        <div style={{ width: '50%' }}>
          <Link
            to={`/videos/${video.videoId}${
              playlistId ? `?playlist=${playlistId}` : ''
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
            flexDirection: 'column'
          }}
        >
          <Link
            to={`/videos/${video.videoId}${
              playlistId ? `?playlist=${playlistId}` : ''
            }`}
          >
            <p style={{ fontSize: '1.2em' }}>{cleanString(video.title)}</p>
          </Link>
          <small style={{ color: Color.gray }}>
            Uploaded by {video.username}
          </small>
        </div>
      </div>
    ))
  }
}

export default connect(
  state => ({
    nextVideos: state.VideoReducer.videoPage.nextVideos,
    relatedVideos: state.VideoReducer.videoPage.relatedVideos,
    otherVideos: state.VideoReducer.videoPage.otherVideos,
    playlistVideos: state.VideoReducer.videoPage.playlistVideos,
    playlistVideosLoadMoreShown:
      state.VideoReducer.videoPage.playlistVideosLoadMoreShown,
    playlistTitle: state.VideoReducer.videoPage.playlistTitle
  }),
  {
    loadMorePlaylistVideos,
    loadRightMenuVideos
  }
)(RightMenu)
