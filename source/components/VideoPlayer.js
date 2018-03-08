import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import YouTube from 'react-youtube'
import Loading from 'components/Loading'
import { Color } from 'constants/css'
import { connect } from 'react-redux'
import { auth } from 'redux/actions/constants'
import {
  addVideoViewAsync,
  fillCurrentVideoSlot,
  emptyCurrentVideoSlot
} from 'redux/actions/VideoActions'
import { changeUserXP } from 'redux/actions/UserActions'
import request from 'axios'
import StarMark from 'components/StarMark'
import { URL } from 'constants/URL'
import ErrorBoundary from 'components/Wrappers/ErrorBoundary'
import ProgressBar from 'components/ProgressBar'
import { css } from 'emotion'
const CONTENT_URL = `${URL}/content`
const VIDEO_URL = `${URL}/video`
const intervalLength = 2000
const denominator = 3
let isMobile

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
    onEdit: PropTypes.bool,
    pageVisible: PropTypes.bool,
    currentVideoSlot: PropTypes.number,
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videoCode: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired
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
    const {
      autoplay,
      hasHqThumb,
      isStarred,
      userId,
      videoCode,
      videoId
    } = this.props
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    this.mounted = true

    if (typeof hasHqThumb !== 'number') {
      try {
        const { data: { payload } } = await request.put(
          `${CONTENT_URL}/videoThumb`,
          { videoCode, videoId }
        )
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
        const { data: { xpEarned } } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        )
        if (this.mounted) this.setState(() => ({ xpEarned: !!xpEarned }))
      } catch (error) {
        console.error(error.response || error)
      }
    }

    if (autoplay || isMobile) {
      this.setState({ playing: true })
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { isStarred, userId, videoCode, videoId } = this.props
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
        imageUrl: `https://img.youtube.com/vi/${
          nextProps.videoCode
        }/${newImageName}.jpg`
      })
    }

    if (isStarred && nextProps.userId && userId !== nextProps.userId) {
      try {
        const { data: { xpEarned } } = await request.get(
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
  }

  componentDidUpdate(prevProps) {
    const {
      onEdit,
      chatMode,
      currentVideoSlot,
      isStarred,
      pageVisible,
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

    if (playing && userWatchingMultipleVideo) {
      this.onVideoStop()
      if (this.player) this.player.pauseVideo()
    }

    if (
      playing &&
      isStarred &&
      pageVisible !== prevProps.pageVisible &&
      !alreadyEarned
    ) {
      this.onVideoStop()
      if (this.player) this.player.pauseVideo()
    }

    if (
      playing &&
      isStarred &&
      chatMode !== prevProps.chatMode &&
      !alreadyEarned
    ) {
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
      isStarred,
      minimized,
      onEdit,
      videoCode,
      title,
      style,
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
      <ErrorBoundary>
        <div
          className={css`
            display: block;
            width: 100%;
            height: auto;
            padding-bottom: 56.25%;
            position: relative;
          `}
          style={{
            ...style,
            display: minimized && !playing && 'none',
            width: playing && minimized && '39rem',
            paddingBottom: playing && minimized && '22rem',
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
              <YouTube
                className={css`
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  z-index: 1;
                `}
                opts={{ title }}
                videoId={videoCode}
                onReady={this.onVideoReady}
                onStateChange={e => {
                  if (e.data === 1) {
                    this.onVideoPlay(e)
                  } else {
                    this.onVideoStop()
                  }
                }}
                onEnd={this.onVideoStop}
              />
            )}
          {!onEdit && !minimized && playing ? (
            <Loading
              className={css`
                color: ${Color.blue()};
                font-size: 3em;
                position: absolute;
                display: block;
                height: 5rem;
                width: 5rem;
                top: 50%;
                left: 50%;
                margin: -2.5rem 0 0 -2.5rem;
              `}
            />
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
              color={
                justEarned
                  ? Color.green()
                  : xpEarned ? Color.lightBlue() : Color.blue()
              }
              text={
                justEarned
                  ? 'Twinkle XP earned!'
                  : xpEarned ? 'You have already earned this XP' : ''
              }
            />
          )}
      </ErrorBoundary>
    )
  }

  onVideoPlay = event => {
    const {
      currentVideoSlot,
      isStarred,
      videoId,
      userId,
      addVideoView,
      fillCurrentVideoSlot
    } = this.props
    const { justEarned, xpEarned } = this.state
    const time = event.target.getCurrentTime()
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

  onVideoReady = event => {
    if (!isMobile) {
      event.target.playVideo()
    }
    this.player = event.target
    this.setState(() => ({
      totalDuration: event.target.getDuration()
    }))
  }

  increaseProgress = async() => {
    const { justEarned, xpEarned, timeWatched, totalDuration } = this.state
    const { changeUserXP, isStarred, videoId } = this.props
    if (isStarred && !xpEarned && !justEarned && this.player) {
      if (this.player.isMuted()) {
        this.player.unMute()
      }
      if (this.player.getVolume() < 30) {
        this.player.setVolume(30)
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
