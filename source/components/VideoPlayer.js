import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import ReactPlayer from 'react-player'
import { Color } from 'constants/css'
import { connect } from 'react-redux'
import { auth } from 'redux/constants'
import {
  addVideoView,
  fillCurrentVideoSlot,
  emptyCurrentVideoSlot
} from 'redux/actions/VideoActions'
import { changeUserXP } from 'redux/actions/UserActions'
import request from 'axios'
import StarMark from 'components/StarMark'
import { URL } from 'constants/URL'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import ProgressBar from 'components/ProgressBar'
import Spinner from 'components/Spinner'
import { css } from 'emotion'

const CONTENT_URL = `${URL}/content`
const VIDEO_URL = `${URL}/video`
const intervalLength = 2000
const denominator = 3

class VideoPlayer extends Component {
  static propTypes = {
    addVideoView: PropTypes.func.isRequired,
    autoplay: PropTypes.bool,
    chatMode: PropTypes.bool,
    emptyCurrentVideoSlot: PropTypes.func,
    fillCurrentVideoSlot: PropTypes.func,
    hasHqThumb: PropTypes.number,
    changeUserXP: PropTypes.func,
    isStarred: PropTypes.bool,
    minimized: PropTypes.bool,
    stretch: PropTypes.bool,
    onEdit: PropTypes.bool,
    pageVisible: PropTypes.bool,
    currentVideoSlot: PropTypes.number,
    style: PropTypes.object,
    userId: PropTypes.number,
    videoCode: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired
  }

  interval = null
  Player = null
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
    const {
      autoplay,
      hasHqThumb,
      isStarred,
      userId,
      videoCode,
      videoId
    } = this.props
    this.mounted = true

    if (typeof hasHqThumb !== 'number') {
      try {
        const {
          data: { payload }
        } = await request.put(`${CONTENT_URL}/videoThumb`, {
          videoCode,
          videoId
        })
        if (this.mounted) {
          this.setState({
            imageUrl:
              payload || `https://img.youtube.com/vi/${videoCode}/mqdefault.jpg`
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
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        )
        if (this.mounted) this.setState(() => ({ xpEarned: !!xpEarned }))
      } catch (error) {
        console.error(error.response || error)
      }
    }

    if (autoplay) {
      this.setState({ playing: true })
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      onEdit,
      chatMode,
      currentVideoSlot,
      hasHqThumb,
      isStarred,
      pageVisible,
      userId,
      videoCode,
      videoId
    } = this.props
    const { playing, xpEarned, justEarned } = this.state
    if (prevProps.onEdit !== onEdit) {
      if (onEdit === true) this.onVideoStop()
      this.setState({ playing: false })
    }
    const userWatchingMultipleVideo =
      currentVideoSlot &&
      currentVideoSlot !== prevProps.currentVideoSlot &&
      currentVideoSlot !== Number(videoId)
    const alreadyEarned = xpEarned || justEarned

    if (prevProps.userId && !userId) {
      this.setState(state => ({
        ...state,
        timeWatched: 0,
        xpEarned: false,
        justEarned: false
      }))
    }

    if (prevProps.videoCode !== videoCode) {
      const newImageName = hasHqThumb ? 'maxresdefault' : 'mqdefault'
      this.setState({
        imageUrl: `https://img.youtube.com/vi/${videoCode}/${newImageName}.jpg`
      })
    }

    if (isStarred && userId && userId !== prevProps.userId) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        )
        if (xpEarned && this.mounted) {
          this.setState(() => ({ xpEarned: !!xpEarned }))
        }
      } catch (error) {
        console.error(error.response || error)
      }
    }

    if (playing && userWatchingMultipleVideo) {
      this.onVideoStop()
      if (this.Player) this.Player.getInternalPlayer().pauseVideo()
    }

    if (
      playing &&
      isStarred &&
      pageVisible !== prevProps.pageVisible &&
      !alreadyEarned
    ) {
      this.onVideoStop()
      if (this.Player) this.Player.getInternalPlayer().pauseVideo()
    }

    if (
      playing &&
      isStarred &&
      chatMode !== prevProps.chatMode &&
      !alreadyEarned
    ) {
      this.onVideoStop()
      if (this.Player) this.Player.getInternalPlayer().pauseVideo()
    }
  }

  componentWillUnmount() {
    this.onVideoStop()
    this.Player = undefined
    this.mounted = false
  }

  render() {
    const {
      isStarred,
      minimized,
      stretch,
      onEdit,
      videoCode,
      style = {},
      userId
    } = this.props
    const {
      imageUrl,
      playing,
      timeWatched,
      totalDuration,
      xpEarned,
      justEarned
    } = this.state
    const requiredViewDuration = totalDuration / denominator
    const progress = xpEarned
      ? 100
      : requiredViewDuration > 0
        ? Math.floor(
            Math.min(timeWatched, requiredViewDuration) *
              100 /
              requiredViewDuration
          )
        : 0
    return (
      <ErrorBoundary style={style}>
        <div
          className={`${css`
            position: relative;
            padding-top: 56.25%;
          `}${minimized ? ' desktop' : ''}`}
          style={{
            display: minimized && !playing && 'none',
            width: playing && minimized && '39rem',
            paddingTop: playing && minimized && '22rem',
            position: playing && minimized && 'absolute',
            bottom: playing && minimized && '1rem',
            right: playing && minimized && '1rem',
            cursor: !onEdit && !playing && 'pointer'
          }}
          onClick={() => {
            if (!onEdit && !playing) {
              this.setState({ playing: true })
            }
          }}
        >
          {!minimized &&
            !playing && (
              <Fragment>
                <img
                  alt=""
                  src={imageUrl}
                  className={css`
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    right: 0;
                    left: 0;
                    bottom: 0;
                  `}
                />
                {isStarred && (
                  <StarMark
                    style={{
                      top: '1rem',
                      left: '1rem'
                    }}
                  />
                )}
              </Fragment>
            )}
          {!onEdit &&
            playing && (
              <ReactPlayer
                ref={ref => {
                  this.Player = ref
                }}
                className={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 1;
                `}
                width="100%"
                height="100%"
                url={`https://www.youtube.com/watch?v=${videoCode}`}
                playing={playing}
                controls
                config={{
                  youtube: { preload: true }
                }}
                onReady={this.onVideoReady}
                onPlay={this.onVideoPlay}
                onPause={this.onVideoStop}
                onEnded={this.onVideoStop}
              />
            )}
          {!onEdit && !minimized && playing ? (
            <div
              className={css`
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                font-size: 3rem;
                display: flex;
                align-items: center;
                justify-content: center;
              `}
              style={style}
            >
              <Spinner />
            </div>
          ) : !onEdit ? (
            <a
              className={css`
                position: absolute;
                display: block;
                background: url('/img/play-button-image.png');
                background-size: contain;
                height: 5rem;
                width: 5rem;
                top: 50%;
                left: 50%;
                margin: -2.5rem 0 0 -2.5rem;
              `}
            />
          ) : null}
        </div>
        {isStarred &&
          !!userId && (
            <ProgressBar
              progress={progress}
              noBorderRadius={stretch}
              color={
                justEarned
                  ? Color.green()
                  : xpEarned
                    ? Color.lightBlue()
                    : Color.blue()
              }
              text={
                justEarned
                  ? 'Twinkle XP earned!'
                  : xpEarned
                    ? 'You have already earned this XP'
                    : ''
              }
            />
          )}
      </ErrorBoundary>
    )
  }

  onVideoReady = () => {
    this.setState(() => ({
      totalDuration: this.Player.getDuration()
    }))
  }

  onVideoPlay = () => {
    const {
      currentVideoSlot,
      isStarred,
      videoId,
      userId,
      addVideoView,
      fillCurrentVideoSlot
    } = this.props
    const { justEarned, xpEarned } = this.state
    const time = this.Player.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({ videoId, userId })
    }
    if (!currentVideoSlot) {
      fillCurrentVideoSlot(Number(videoId))
      if (userId) {
        this.interval = setInterval(this.increaseProgress, intervalLength)
      }
    }
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists && isStarred && !(justEarned || xpEarned)) {
      try {
        request.put(
          `${VIDEO_URL}/currentlyWatching`,
          { videoId },
          authorization
        )
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  onVideoStop = () => {
    const { emptyCurrentVideoSlot } = this.props
    clearInterval(this.interval)
    emptyCurrentVideoSlot()
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists) {
      try {
        request.put(
          `${VIDEO_URL}/currentlyWatching`,
          { videoId: null },
          authorization
        )
      } catch (error) {
        console.error(error.response || error)
      }
    }
  }

  increaseProgress = async() => {
    const { justEarned, xpEarned, timeWatched, totalDuration } = this.state
    const { changeUserXP, isStarred, videoId } = this.props
    if (isStarred && !xpEarned && !justEarned && this.Player) {
      if (this.Player.getInternalPlayer().isMuted()) {
        this.Player.getInternalPlayer().unMute()
      }
      if (this.Player.getInternalPlayer().getVolume() < 30) {
        this.Player.getInternalPlayer().setVolume(30)
      }
    }
    if (
      isStarred &&
      timeWatched >= totalDuration / denominator &&
      !this.rewardingXP
    ) {
      this.rewardingXP = true
      try {
        await request.put(`${VIDEO_URL}/xpEarned`, { videoId }, auth())
        await changeUserXP({
          type: 'increase',
          action: 'watch',
          target: 'video',
          targetId: videoId,
          amount: 100
        })
        if (this.mounted) {
          this.setState(() => ({
            justEarned: true,
            xpEarned: true
          }))
        }
        this.rewardingXP = false
      } catch (error) {
        console.error(error.response || error)
      }
    }
    if (!xpEarned && this.mounted) {
      this.setState(state => ({
        timeWatched: state.timeWatched + intervalLength / 1000
      }))
    }
    const authorization = auth()
    const authExists = !!authorization.headers.authorization
    if (authExists) {
      try {
        const {
          data: { currentlyWatchingAnotherVideo, success }
        } = await request.put(
          `${VIDEO_URL}/duration`,
          { videoId, isStarred, xpEarned },
          authorization
        )
        if (success) return
        if (currentlyWatchingAnotherVideo) {
          if (this.Player) this.Player.getInternalPlayer().pauseVideo()
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
    addVideoView,
    changeUserXP,
    fillCurrentVideoSlot,
    emptyCurrentVideoSlot
  }
)(VideoPlayer)
