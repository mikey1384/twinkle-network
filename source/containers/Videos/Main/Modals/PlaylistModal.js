import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import LoadMoreButton from 'components/LoadMoreButton'
import Loading from 'components/Loading'
import {Color} from 'constants/css'
import {cleanString} from 'helpers/stringHelpers'
import Link from 'components/Link'
import request from 'axios'
import {URL} from 'constants/URL'
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions'
import {connect} from 'react-redux'
import {queryStringForArray} from 'helpers/apiHelpers'

const API_URL = `${URL}/playlist`

class PlaylistModal extends Component {
  static propTypes = {
    loadVideoPage: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    playlistId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }

  constructor() {
    super()
    this.state = {
      videos: [],
      loadMoreButtonShown: false,
      loading: false
    }
    this.onLoadMoreVideos = this.onLoadMoreVideos.bind(this)
  }

  componentWillMount() {
    const {playlistId} = this.props
    request.get(`${API_URL}/playlist?playlistId=${playlistId}`).then(
      response => {
        let loadMoreButtonShown = false
        if (response.data.length > 10) {
          response.data.pop()
          loadMoreButtonShown = true
        }
        this.setState({
          videos: response.data,
          loadMoreButtonShown
        })
      }
    ).catch(
      error => console.error(error.response || error)
    )
  }

  render() {
    const {loadVideoPage, onHide, playlistId, title} = this.props
    const {videos, loading, loadMoreButtonShown} = this.state
    return (
      <Modal
        show
        onHide={onHide}
        animation={false}
      >
        <Modal.Header closeButton>
          <h4>{title}</h4>
        </Modal.Header>
        <Modal.Body>
          {videos.length === 0 && <Loading text="Loading..." />}
          {videos.map(video =>
            <div
              key={video.id}
              className="media"
            >
              <div className="media-left media-middle">
                <Link
                  to={`/videos/${video.id}?playlist=${playlistId}`}
                  onClickAsync={() => loadVideoPage(video.id)}
                >
                  <img
                    className="media-object"
                    src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
                    alt="..."
                    style={{width: '18rem'}}
                  />
                </Link>
              </div>
              <div className="media-body">
                <Link
                  to={`/videos/${video.id}?playlist=${playlistId}`}
                  onClickAsync={() => loadVideoPage(video.id)}
                >
                  <p style={{fontSize: '1.2em'}} className="media-heading">{cleanString(video.title)}</p>
                </Link>
                <small style={{color: Color.gray}}>Uploaded by {video.uploaderName}</small>
              </div>
            </div>
          )}
          {loadMoreButtonShown && <LoadMoreButton
            style={{marginTop: '1.5em'}}
            loading={loading}
            onClick={this.onLoadMoreVideos}
          />}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-default" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  onLoadMoreVideos() {
    const {playlistId} = this.props
    const {videos} = this.state
    this.setState({loading: true})
    request.get(`
      ${API_URL}/playlist?playlistId=${playlistId}&${queryStringForArray(videos, 'id', 'shownVideos')}
    `).then(
      response => {
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
      }
    ).catch(
      error => console.error(error.response || error)
    )
  }
}

export default connect(
  null,
  {loadVideoPage: loadVideoPageFromClientSideAsync}
)(PlaylistModal)
