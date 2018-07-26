import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import Button from 'components/Button'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import { Color } from 'constants/css'
import { cleanString, queryStringForArray } from 'helpers/stringHelpers'
import { Link } from 'react-router-dom'
import request from 'axios'
import { URL } from 'constants/URL'
import VideoThumbImage from 'components/VideoThumbImage'

const API_URL = `${URL}/playlist`

export default class PlaylistModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    playlistId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }

  state = {
    videos: [],
    loadMoreButtonShown: false,
    loading: false
  }

  componentDidMount() {
    const { playlistId } = this.props
    request
      .get(`${API_URL}/playlist?playlistId=${playlistId}`)
      .then(response => {
        let loadMoreButtonShown = false
        if (response.data.length > 10) {
          response.data.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          videos: response.data,
          loadMoreButtonShown
        })
      })
      .catch(error => console.error(error.response || error))
  }

  render() {
    const { onHide, playlistId, title } = this.props
    const { videos, loading, loadMoreButtonShown } = this.state
    return (
      <Modal onHide={onHide}>
        <header>{title}</header>
        <main>
          {videos.length === 0 && <Loading relative text="Loading..." />}
          {videos.map((video, index) => (
            <div
              key={video.id}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
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
                <Link to={`/videos/${video.id}?playlist=${playlistId}`}>
                  <p
                    style={{
                      fontSize: '1.9rem',
                      fontWeight: 'bold',
                      lineHeight: 1.5
                    }}
                  >
                    {cleanString(video.title)}
                  </p>
                </Link>
                <small style={{ color: Color.gray() }}>
                  Uploaded by {video.uploaderName}
                </small>
              </div>
            </div>
          ))}
          {loadMoreButtonShown && (
            <LoadMoreButton
              style={{ marginTop: '1.5em' }}
              loading={loading}
              onClick={this.onLoadMoreVideos}
            />
          )}
        </main>
        <footer>
          <Button transparent onClick={onHide}>
            Close
          </Button>
        </footer>
      </Modal>
    )
  }

  onLoadMoreVideos = () => {
    const { playlistId } = this.props
    const { videos } = this.state
    this.setState({ loading: true })
    request
      .get(
        `${API_URL}/playlist?playlistId=${playlistId}&${queryStringForArray(
          videos,
          'id',
          'shownVideos'
        )}`
      )
      .then(response => {
        let loadMoreButtonShown = false
        if (response.data.length > 10) {
          response.data.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          videos: videos.concat(response.data),
          loadMoreButtonShown,
          loading: false
        })
      })
      .catch(error => console.error(error.response || error))
  }
}
