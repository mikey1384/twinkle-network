import PropTypes from 'prop-types'
import React, {Component} from 'react'
import YouTube from 'react-youtube'
import Loading from 'components/Loading'
import {Color} from 'constants/css'
import {connect} from 'react-redux'
import {addVideoViewAsync} from 'redux/actions/VideoActions'
import request from 'axios'
import StarMark from 'components/StarMark'
import VisibilityWrapper from 'components/Wrappers/VisibilityWrapper'
import {URL} from 'constants/URL'

const API_URL = `${URL}/content`
let interval
let isMobile

class VideoPlayer extends Component {
  static propTypes = {
    addVideoView: PropTypes.func.isRequired,
    autoplay: PropTypes.bool,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    hasHqThumb: PropTypes.number,
    isStarred: PropTypes.bool,
    onEdit: PropTypes.bool,
    pageVisible: PropTypes.bool,
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

  player = null

  constructor({autoplay, hasHqThumb, videoCode}) {
    super()
    const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault'
    this.state = {
      playing: autoplay,
      imageUrl: `https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`,
      timeWatched: 0,
      totalDuration: 0,
      mined: false
    }
  }

  componentDidMount() {
    const {hasHqThumb, videoCode, videoId} = this.props
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
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
    const {isStarred, pageVisible, videoCode} = this.props
    if (videoCode !== nextProps.videoCode) {
      const nextImageName = nextProps.hasHqThumb ? 'maxresdefault' : 'mqdefault'
      this.setState({imageUrl: `https://img.youtube.com/vi/${nextProps.videoCode}/${nextImageName}.jpg`})
    }
    if (this.player && isStarred && pageVisible !== nextProps.pageVisible) {
      this.player.pauseVideo()
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
    const {isStarred, videoCode, title, containerClassName, className, onEdit, style, small} = this.props
    const {imageUrl, playing, mined, timeWatched, totalDuration} = this.state
    const progress = totalDuration > 0 ? Math.floor(timeWatched * 100 / (totalDuration / 2)) : 0
    return (
      <VisibilityWrapper onChange={this.onVisibilityChange}>
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
            {isStarred &&
              <StarMark
                style={{
                  marginTop: '0.5em',
                  marginLeft: '0.5em'
                }}
              />
            }
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
              onPlay={this.onVideoPlay}
              onPause={this.onVideoStop}
              onEnd={this.onVideoStop}
            />
          }
        </div>
        {isStarred &&
          <div className="progress" style={{marginTop: '1rem'}}>
            <div
              className={`progress-bar progress-bar-${mined ? 'success' : 'info'}`}
              style={{width: `${progress}%`}}
            >
              {mined ? 'You have mined this Star!' : `${progress}% mined`}
            </div>
          </div>
        }
      </VisibilityWrapper>
    )
  }

  onVideoPlay = (event) => {
    const {videoId, userId, addVideoView} = this.props
    const time = event.target.getCurrentTime()
    interval = window.setInterval(this.increaseProgress, 1000)
    if (Math.floor(time) === 0) {
      addVideoView({videoId, userId})
    }
  }

  onVideoStop = (event) => {
    window.clearInterval(interval)
  }

  onVideoReady = (event) => {
    if (!isMobile) {
      event.target.playVideo()
    }
    this.player = event.target
    this.setState(() => ({totalDuration: event.target.getDuration()}))
  }

  onVisibilityChange = (isVisible) => {
    const {isStarred} = this.props
    if (this.player && isStarred && !isVisible) {
      this.player.pauseVideo()
    }
  }

  increaseProgress = () => {
    const {mined, timeWatched, totalDuration} = this.state
    if (timeWatched >= totalDuration / 2) {
      this.setState(() => ({mined: true}))
    }
    // record watchtime to db
    if (!mined) this.setState(state => ({timeWatched: state.timeWatched + 1}))
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    pageVisible: state.ViewReducer.pageVisible
  }),
  {addVideoView: addVideoViewAsync}
)(VideoPlayer)
