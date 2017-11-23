import PropTypes from 'prop-types'
import React, {Component} from 'react'
import YouTube from 'react-youtube'
import Loading from 'components/Loading'
import {Color} from 'constants/css'
import {connect} from 'react-redux'
import {auth} from 'redux/actions/constants'
import {
  addVideoViewAsync,
  fillCurrentVideoSlot,
  emptyCurrentVideoSlot
} from 'redux/actions/VideoActions'
import {changeUserXP} from 'redux/actions/UserActions'
import request from 'axios'
import StarMark from 'components/StarMark'
import {URL} from 'constants/URL'

const CONTENT_URL = `${URL}/content`
const VIDEO_URL = `${URL}/video`
const intervalLength = 2000
let isMobile

class VideoPlayer extends Component {
  static propTypes = {
    addVideoView: PropTypes.func.isRequired,
    autoplay: PropTypes.bool,
    chatMode: PropTypes.bool,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    emptyCurrentVideoSlot: PropTypes.func,
    fillCurrentVideoSlot: PropTypes.func,
    hasHqThumb: PropTypes.number,
    changeUserXP: PropTypes.func,
    isStarred: PropTypes.bool,
    onEdit: PropTypes.bool,
    pageVisible: PropTypes.bool,
    small: PropTypes.bool,
    currentVideoSlot: PropTypes.number,
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoCode: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }

  interval
  player = null
  rewardingXP = false

  constructor({autoplay, hasHqThumb, videoCode}) {
    super()
    const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault'
    this.state = {
      playing: autoplay,
      imageUrl: `https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`,
      timeWatched: 0,
      totalDuration: 0,
      xpEarned: false,
      justEarned: false
    }
  }

  async componentDidMount() {
    const {isStarred, hasHqThumb, userId, videoCode, videoId} = this.props
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.mounted = true
    if (typeof hasHqThumb !== 'number') {
      try {
        const {data: {payload}} = await request.put(`${CONTENT_URL}/videoThumb`, {videoCode, videoId})
        if (this.mounted && payload) this.setState({imageUrl: payload})
      } catch (error) {
        console.error(error.response || error)
      }
    }
    if (isStarred && userId) {
      try {
        const {data: {xpEarned}} = await request.get(`${VIDEO_URL}/xpEarned?videoId=${videoId}`, auth())
        this.setState(() => ({xpEarned: !!xpEarned}))
      } catch (error) {
        console.error(error.response || error)
      }
    }
    if (isMobile) {
      this.setState({playing: true})
    }
  }

  async componentWillUpdate(nextProps) {
    const {isStarred, userId, videoId, videoCode} = this.props
    if (videoCode !== nextProps.videoCode) {
      const nextImageName = nextProps.hasHqThumb ? 'maxresdefault' : 'mqdefault'
      this.setState({imageUrl: `https://img.youtube.com/vi/${nextProps.videoCode}/${nextImageName}.jpg`})
    }

    if (isStarred && nextProps.userId && (userId !== nextProps.userId)) {
      try {
        const {data: {xpEarned}} = await request.get(`${VIDEO_URL}/xpEarned?videoId=${videoId}`, auth())
        if (xpEarned) this.setState(() => ({xpEarned: !!xpEarned}))
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {onEdit, chatMode, currentVideoSlot, isStarred, pageVisible, videoId} = this.props
    const {xpEarned, justEarned} = this.state
    if (prevProps.onEdit !== onEdit) {
      this.setState({playing: false})
    }
    const userWatchingMultipleVideo = this.player && currentVideoSlot !== prevProps.currentVideoSlot && currentVideoSlot !== Number(videoId)
    const alreadyEarned = xpEarned || justEarned

    if (userWatchingMultipleVideo) {
      this.player.pauseVideo()
    }

    if (this.player && isStarred && pageVisible !== prevProps.pageVisible && !alreadyEarned) {
      this.player.pauseVideo()
    }

    if (this.player && isStarred && chatMode !== prevProps.chatMode && !alreadyEarned) {
      this.player.pauseVideo()
    }
  }

  componentWillUnmount() {
    const {emptyCurrentVideoSlot} = this.props
    emptyCurrentVideoSlot()
    this.mounted = false
  }

  render() {
    const {
      isStarred, videoCode, title, containerClassName, className, onEdit, style, small, userId
    } = this.props
    const {imageUrl, playing, timeWatched, totalDuration, xpEarned, justEarned} = this.state
    const halfDuration = totalDuration / 2
    const progress = xpEarned ? 100 : (
      halfDuration > 0 ? Math.floor(Math.min(timeWatched, halfDuration) * 100 / halfDuration) : 0
    )
    return (
      <div>
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
        {isStarred && !!userId &&
          <div className="progress" style={{marginTop: '1rem'}}>
            <div
              className={`progress-bar progress-bar-${justEarned ? 'success' : xpEarned ? 'info' : 'primary'}`}
              style={{width: `${progress}%`}}
            >
              {justEarned ? 'Twinkle XP earned!' : xpEarned ? 'You have already earned this XP' : `${progress}%`}
            </div>
          </div>
        }
      </div>
    )
  }

  onVideoPlay = (event) => {
    const {videoId, userId, addVideoView, fillCurrentVideoSlot} = this.props
    const time = event.target.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({videoId, userId})
    }
    fillCurrentVideoSlot(Number(videoId))
    if (userId) this.interval = window.setInterval(this.increaseProgress, intervalLength)
  }

  onVideoStop = (event) => {
    window.clearInterval(this.interval)
  }

  onVideoReady = (event) => {
    if (!isMobile) {
      event.target.playVideo()
    }
    this.player = event.target
    this.setState(() => ({totalDuration: event.target.getDuration()}))
  }

  increaseProgress = async() => {
    const {xpEarned, timeWatched, totalDuration} = this.state
    const {changeUserXP, videoId} = this.props
    if (timeWatched >= totalDuration / 2 && !this.rewardingXP) {
      this.rewardingXP = true
      try {
        await request.put(`${VIDEO_URL}/xpEarned`, {videoId}, auth())
        await changeUserXP({type: 'increase', action: 'watch', target: 'video', amount: 100})
        this.setState(() => ({
          justEarned: true
        }))
      } catch (error) {
        console.error(error.response || error)
      }
    }
    if (!xpEarned) this.setState(state => ({timeWatched: state.timeWatched + intervalLength / 1000}))
    try {
      return await request.put(`${VIDEO_URL}/duration`, {videoId}, auth())
    } catch (error) {
      console.error(error.response || error)
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    userId: state.UserReducer.userId,
    pageVisible: state.ViewReducer.pageVisible,
    currentVideoSlot: state.VideoReducer.currentVideoSlot
  }),
  {
    addVideoView: addVideoViewAsync,
    changeUserXP,
    fillCurrentVideoSlot,
    emptyCurrentVideoSlot
  }
)(VideoPlayer)
