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
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'

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

  interval = null
  player = null
  rewardingXP = false

  state = {
    playing: false,
    timeWatched: 0,
    totalDuration: 0,
    xpEarned: false,
    justEarned: false,
    imageUrl: ''
  }

  async componentDidMount() {
    const {autoplay, hasHqThumb, isStarred, userId, videoCode, videoId} = this.props
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.mounted = true

    if (typeof hasHqThumb !== 'number') {
      try {
        const {data: {payload}} = await request.put(`${CONTENT_URL}/videoThumb`, {videoCode, videoId})
        if (this.mounted) {
          this.setState({
            imageUrl: payload || `https://img.youtube.com/vi/${videoCode}/mqdefault.jpg`
          })
        }
      } catch (error) {
        console.error(error.response || error)
      }
    } else {
      const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault'
      this.setState({
        imageUrl: `https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`
      })
    }

    if (isStarred && userId) {
      try {
        const {data: {xpEarned}} = await request.get(`${VIDEO_URL}/xpEarned?videoId=${videoId}`, auth())
        if (this.mounted) this.setState(() => ({xpEarned: !!xpEarned}))
      } catch (error) {
        console.error(error.response || error)
      }
    }

    if (autoplay || isMobile) {
      this.setState({playing: true})
    }
  }

  async componentWillReceiveProps(nextProps) {
    const {isStarred, userId, videoCode, videoId} = this.props
    if (userId && !nextProps.userId) {
      this.setState(state => ({
        ...state,
        timeWatched: 0,
        xpEarned: false,
        justEarned: false
      }))
    }

    if (videoCode !== nextProps.videoCode) {
      const newImageName = nextProps.hasHqThumb ? 'maxresdefault' : 'mqdefault'
      this.setState({
        imageUrl: `https://img.youtube.com/vi/${nextProps.videoCode}/${newImageName}.jpg`
      })
    }

    if (isStarred && nextProps.userId && (userId !== nextProps.userId)) {
      try {
        const {data: {xpEarned}} = await request.get(`${VIDEO_URL}/xpEarned?videoId=${videoId}`, auth())
        if (xpEarned && this.mounted) this.setState(() => ({xpEarned: !!xpEarned}))
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {onEdit, chatMode, currentVideoSlot, isStarred, pageVisible, videoId} = this.props
    const {playing, xpEarned, justEarned} = this.state
    if (prevProps.onEdit !== onEdit) {
      if (onEdit === true) this.onVideoStop()
      this.setState({playing: false})
    }
    const userWatchingMultipleVideo = currentVideoSlot && currentVideoSlot !== prevProps.currentVideoSlot && currentVideoSlot !== Number(videoId)
    const alreadyEarned = xpEarned || justEarned

    if (playing && userWatchingMultipleVideo) {
      this.onVideoStop()
      if (this.player) this.player.pauseVideo()
    }

    if (playing && isStarred && pageVisible !== prevProps.pageVisible && !alreadyEarned) {
      this.onVideoStop()
      if (this.player) this.player.pauseVideo()
    }

    if (playing && isStarred && chatMode !== prevProps.chatMode && !alreadyEarned) {
      this.onVideoStop()
      if (this.player) this.player.pauseVideo()
    }
  }

  componentWillUnmount() {
    this.onVideoStop()
    this.mounted = false
  }

  render() {
    const {
      isStarred, onEdit, videoCode, title, containerClassName, className, style, small, userId
    } = this.props
    const {imageUrl, playing, timeWatched, totalDuration, xpEarned, justEarned} = this.state
    const halfDuration = totalDuration / 2
    const progress = xpEarned ? 100 : (
      halfDuration > 0 ? Math.floor(Math.min(timeWatched, halfDuration) * 100 / halfDuration) : 0
    )
    return (
      <ErrorBoundary>
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
              onStateChange={(e) => {
                if (e.data === 1) {
                  this.onVideoPlay(e)
                } else {
                  this.onVideoStop()
                }
              }}
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
      </ErrorBoundary>
    )
  }

  onVideoPlay = (event) => {
    const {currentVideoSlot, videoId, userId, addVideoView, fillCurrentVideoSlot} = this.props
    const time = event.target.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({videoId, userId})
    }
    if (!currentVideoSlot) {
      fillCurrentVideoSlot(Number(videoId))
      if (userId) this.interval = setInterval(this.increaseProgress, intervalLength)
    }
  }

  onVideoStop = () => {
    const {emptyCurrentVideoSlot, videoId} = this.props
    clearInterval(this.interval)
    emptyCurrentVideoSlot()
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists) {
      try {
        request.put(`${VIDEO_URL}/clearCurrentlyWatching`, {videoId}, auth())
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  onVideoReady = (event) => {
    if (!isMobile) {
      event.target.playVideo()
    }
    this.player = event.target
    this.setState(() => ({
      totalDuration: event.target.getDuration()}
    ))
  }

  increaseProgress = async() => {
    const {xpEarned, timeWatched, totalDuration} = this.state
    const {changeUserXP, isStarred, videoId} = this.props
    if (isStarred && timeWatched >= totalDuration / 2 && !this.rewardingXP) {
      this.rewardingXP = true
      try {
        await request.put(`${VIDEO_URL}/xpEarned`, {videoId}, auth())
        await changeUserXP({type: 'increase', action: 'watch', target: 'video', targetId: videoId, amount: 100})
        if (this.mounted) {
          this.setState(() => ({
            justEarned: true,
            xpEarned: true
          }))
        }
      } catch (error) {
        console.error(error.response || error)
      }
    }
    if (!xpEarned && this.mounted) this.setState(state => ({timeWatched: state.timeWatched + intervalLength / 1000}))
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists) {
      try {
        const {
          data: {
            currentlyWatchingAnotherVideo,
            success
          }
        } = await request.put(`${VIDEO_URL}/duration`, {videoId, isStarred, xpEarned}, authorization)
        if (success) return
        if (currentlyWatchingAnotherVideo) {
          if (this.player) this.player.pauseVideo()
        }
      } catch (error) {
        console.error(error.response || error)
      }
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
