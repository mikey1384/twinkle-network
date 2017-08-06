import PropTypes from 'prop-types'
import React, {Component} from 'react'
import YouTube from 'react-youtube'
import Loading from 'components/Loading'
import {Color} from 'constants/css'
import {connect} from 'react-redux'
import {addVideoViewAsync} from 'redux/actions/VideoActions'
import request from 'axios'
import {URL} from 'constants/URL'

const API_URL = `${URL}/content`
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

class VideoPlayer extends Component {
  static propTypes = {
    addVideoView: PropTypes.func.isRequired,
    autoplay: PropTypes.bool,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    hasHqThumb: PropTypes.number,
    onEdit: PropTypes.bool,
    small: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoCode: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }

  constructor({autoplay, hasHqThumb, videoCode}) {
    super()
    const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault'
    this.state = {
      playing: autoplay,
      imageUrl: `https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`
    }
    this.onVideoReady = this.onVideoReady.bind(this)
  }

  componentDidMount() {
    const {hasHqThumb, videoCode, videoId} = this.props
    this.mounted = true
    if (typeof hasHqThumb !== 'number') {
      return request.put(`${API_URL}/videoThumb`, {videoCode, videoId}).then(
        ({data: {payload}}) => {
          if (this.mounted && payload) this.setState({imageUrl: payload})
        }
      ).catch(
        error => console.error(error.response || error)
      )
    }
    if (isMobile) {
      this.setState({playing: true})
    }
  }

  componentWillUpdate(nextProps) {
    const {videoCode} = this.props
    if (videoCode !== nextProps.videoCode) {
      const nextImageName = nextProps.hasHqThumb ? 'maxresdefault' : 'mqdefault'
      this.setState({imageUrl: `https://img.youtube.com/vi/${nextProps.videoCode}/${nextImageName}.jpg`})
    }
  }

  componentDidUpdate(prevProps) {
    const {onEdit} = this.props
    if (prevProps.onEdit !== onEdit) {
      this.setState({playing: false})
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {videoCode, title, containerClassName, className, onEdit, style, small} = this.props
    const {imageUrl, playing} = this.state
    return (
      <div
        className={small ? containerClassName : `video-player ${containerClassName}`}
        style={{...style, cursor: (!onEdit && !playing) && 'pointer'}}
        onClick={() => {
          if (!onEdit && !playing) {
            this.setState({playing: true})
          }
        }}
      >
        {((!small && !playing) || onEdit) && <div>
          <img
            alt=""
            className="embed-responsive-item"
            src={imageUrl}
          />
        </div>}
        {(!onEdit && !small && playing) ?
          <Loading
            style={{
              color: Color.blue,
              fontSize: '3em',
              position: 'absolute',
              display: 'block',
              height: '40px',
              width: '40px',
              top: '50%',
              left: '50%',
              margin: '-20px 0 0 -20px'
            }}
          /> : (!onEdit ? <a></a> : null)
        }
        {!onEdit && playing &&
          <YouTube
            className={className}
            opts={{title}}
            videoId={videoCode}
            onReady={this.onVideoReady}
          />
        }
      </div>
    )
  }

  onVideoReady(event) {
    const {videoId, userId, addVideoView} = this.props
    if (!isMobile) {
      event.target.playVideo()
    }
    const time = event.target.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({videoId, userId})
    }
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  {addVideoView: addVideoViewAsync}
)(VideoPlayer)
