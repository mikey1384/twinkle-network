import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Color } from 'constants/css';
import { connect } from 'react-redux';
import { auth } from 'helpers/requestHelpers';
import { addCommasToNumber } from 'helpers/stringHelpers';
import {
  addVideoView,
  fillCurrentVideoSlot,
  emptyCurrentVideoSlot
} from 'redux/actions/VideoActions';
import { changeUserXP } from 'redux/actions/UserActions';
import request from 'axios';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { css } from 'emotion';
import { rewardValue } from 'constants/defaultValues';
import URL from 'constants/URL';

const CONTENT_URL = `${URL}/content`;
const VIDEO_URL = `${URL}/video`;
const intervalLength = 2000;
const requiredDurationCap = twinkleXP =>
  60 + Math.min(twinkleXP, 120000) / 1000;
const xp = rewardValue.star;

class VideoPlayer extends Component {
  static propTypes = {
    addVideoView: PropTypes.func.isRequired,
    byUser: PropTypes.bool,
    chatMode: PropTypes.bool,
    difficulty: PropTypes.number,
    emptyCurrentVideoSlot: PropTypes.func,
    fillCurrentVideoSlot: PropTypes.func,
    hasHqThumb: PropTypes.number,
    changeUserXP: PropTypes.func,
    minimized: PropTypes.bool,
    stretch: PropTypes.bool,
    onEdit: PropTypes.bool,
    pageVisible: PropTypes.bool,
    currentVideoSlot: PropTypes.number,
    style: PropTypes.object,
    twinkleXP: PropTypes.number,
    uploader: PropTypes.object.isRequired,
    userId: PropTypes.number,
    videoCode: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired
  };

  interval = null;
  Player = null;
  rewardingXP = false;
  playing = false;

  state = {
    started: false,
    timeWatched: 0,
    totalDuration: 0,
    xpLoaded: false,
    xpEarned: false,
    justEarned: false,
    imageUrl: ''
  };

  async componentDidMount() {
    const { hasHqThumb, difficulty, userId, videoCode, videoId } = this.props;
    this.mounted = true;

    if (videoCode && typeof hasHqThumb !== 'number') {
      try {
        const {
          data: { payload }
        } = await request.put(`${CONTENT_URL}/videoThumb`, {
          videoCode,
          videoId
        });
        if (this.mounted) {
          this.setState({
            imageUrl:
              payload || `https://img.youtube.com/vi/${videoCode}/mqdefault.jpg`
          });
        }
      } catch (error) {
        console.error(error.response || error);
      }
    } else {
      const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
      this.setState({
        imageUrl: `https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`
      });
    }

    if (!!difficulty && userId) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        );
        if (this.mounted) {
          this.setState(state => ({ xpEarned: !!xpEarned, xpLoaded: true }));
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      onEdit,
      chatMode,
      currentVideoSlot,
      hasHqThumb,
      difficulty,
      pageVisible,
      userId,
      videoCode,
      videoId
    } = this.props;
    const { started, xpEarned, justEarned } = this.state;
    if (prevProps.onEdit !== onEdit) {
      if (onEdit === true) this.onVideoStop();
      this.setState({ started: false });
    }
    const userWatchingMultipleVideo =
      currentVideoSlot &&
      currentVideoSlot !== prevProps.currentVideoSlot &&
      currentVideoSlot !== Number(videoId);
    const alreadyEarned = xpEarned || justEarned;

    if (prevProps.userId && !userId) {
      this.setState(state => ({
        ...state,
        timeWatched: 0,
        xpEarned: false,
        justEarned: false,
        xpLoaded: false
      }));
    }

    if (prevProps.videoCode !== videoCode) {
      const newImageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
      this.setState({
        imageUrl: `https://img.youtube.com/vi/${videoCode}/${newImageName}.jpg`
      });
    }

    if (
      !!difficulty &&
      ((userId && userId !== prevProps.userId) || !prevProps.difficulty)
    ) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        );
        if (this.mounted) {
          this.setState(state => ({
            xpEarned: !!xpEarned,
            xpLoaded: true
          }));
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }

    if (started && userWatchingMultipleVideo) {
      this.onVideoStop();
      if (this.Player) {
        if (this.Player.getInternalPlayer()) {
          this.Player.getInternalPlayer().pauseVideo();
        }
      }
    }

    if (
      started &&
      !!difficulty &&
      userId &&
      pageVisible !== prevProps.pageVisible &&
      !alreadyEarned
    ) {
      this.onVideoStop();
      if (this.Player) {
        if (this.Player.getInternalPlayer()) {
          this.Player.getInternalPlayer().pauseVideo();
        }
      }
    }

    if (
      started &&
      !!difficulty &&
      chatMode !== prevProps.chatMode &&
      !alreadyEarned
    ) {
      this.onVideoStop();
      if (this.Player) {
        if (this.Player.getInternalPlayer()) {
          this.Player.getInternalPlayer().pauseVideo();
        }
      }
    }
  }

  componentWillUnmount() {
    this.onVideoStop();
    this.Player = undefined;
    this.mounted = false;
  }

  render() {
    const {
      byUser,
      difficulty,
      minimized,
      stretch,
      onEdit,
      videoCode,
      style = {},
      uploader,
      userId
    } = this.props;
    const {
      imageUrl,
      started,
      timeWatched,
      totalDuration,
      xpEarned,
      xpLoaded,
      justEarned
    } = this.state;
    const meterColor = xpEarned
      ? Color.green()
      : difficulty === 5
      ? Color.gold()
      : difficulty === 4
      ? Color.rose()
      : difficulty === 3
      ? Color.orange()
      : difficulty === 2
      ? Color.pink()
      : Color.logoBlue();
    return (
      <ErrorBoundary style={style}>
        {byUser && (
          <div
            style={{
              background: Color.brown(),
              color: '#fff',
              padding: '0.5rem',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div>
              This video was made by {uploader.username}.{' '}
              {uploader.youtubeUrl && (
                <a
                  style={{
                    color: '#fff',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={uploader.youtubeUrl}
                >
                  {`Visit ${uploader.username}'s`} YouTube Channel
                </a>
              )}
            </div>
          </div>
        )}
        <div
          className={`${css`
            user-select: none;
            position: relative;
            padding-top: 56.25%;
          `}${minimized ? ' desktop' : ''}`}
          style={{
            display: minimized && !started && 'none',
            width: started && minimized && '39rem',
            paddingTop: started && minimized && '22rem',
            position: started && minimized && 'absolute',
            bottom: started && minimized && '1rem',
            right: started && minimized && '1rem',
            cursor: !onEdit && !started && 'pointer'
          }}
          onClick={() => {
            if (!onEdit && !started) {
              this.setState({ started: true });
            }
          }}
        >
          {!minimized && !started && (
            <>
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
            </>
          )}
          {!onEdit && (
            <ReactPlayer
              ref={ref => {
                this.Player = ref;
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
              playing={started}
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
          {!onEdit && !minimized && started ? (
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
        {(!userId || xpLoaded) && !!difficulty && (!started || xpEarned) && (
          <div
            style={{
              background: meterColor,
              padding: '0.5rem',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!xpEarned && (
              <div>
                {[...Array(difficulty)].map((elem, index) => (
                  <Icon key={index} icon="star" />
                ))}
              </div>
            )}
            <div style={{ marginLeft: !xpEarned ? '0.7rem' : 0 }}>
              {xpEarned
                ? 'You have already earned XP from this video'
                : ` Watch this video and earn ${addCommasToNumber(
                    difficulty * xp
                  )} XP`}
            </div>
          </div>
        )}
        {!xpEarned && !!difficulty && userId && started && (
          <ProgressBar
            progress={this.determineProgress({
              timeWatched,
              totalDuration,
              xpEarned
            })}
            noBorderRadius={stretch}
            color={justEarned ? Color.green() : meterColor}
            text={
              justEarned
                ? `Earned ${addCommasToNumber(difficulty * xp)} XP!`
                : ''
            }
          />
        )}
      </ErrorBoundary>
    );
  }

  determineProgress = ({ timeWatched, totalDuration, xpEarned }) => {
    const { twinkleXP } = this.props;
    let requiredViewDuration =
      totalDuration < requiredDurationCap(twinkleXP)
        ? totalDuration - 3
        : requiredDurationCap(twinkleXP);
    const progress = xpEarned
      ? 100
      : requiredViewDuration > 0
      ? Math.floor(
          (Math.min(timeWatched, requiredViewDuration) * 100) /
            requiredViewDuration
        )
      : 0;
    return progress;
  };

  onVideoReady = () => {
    if (this.Player.getInternalPlayer()) {
      this.setState(() => ({
        totalDuration: this.Player.getInternalPlayer().getDuration()
      }));
    }
  };

  onVideoPlay = () => {
    const {
      currentVideoSlot,
      difficulty,
      videoId,
      userId,
      addVideoView,
      fillCurrentVideoSlot
    } = this.props;
    const { justEarned, xpEarned } = this.state;
    this.setState({ started: true });
    if (!this.playing) {
      this.playing = true;
      const time = this.Player.getCurrentTime();
      if (Math.floor(time) === 0) {
        addVideoView({ videoId, userId });
      }
      if (!currentVideoSlot) {
        fillCurrentVideoSlot(Number(videoId));
        if (userId) {
          this.interval = setInterval(this.increaseProgress, intervalLength);
        }
      }
      const authorization = auth();
      const authExists = !!authorization.headers.authorization;
      if (authExists && !!difficulty && !(justEarned || xpEarned)) {
        try {
          request.put(
            `${VIDEO_URL}/currentlyWatching`,
            { videoId },
            authorization
          );
        } catch (error) {
          console.error(error.response || error);
        }
      }
    }
  };

  onVideoStop = () => {
    const { emptyCurrentVideoSlot } = this.props;
    this.playing = false;
    clearInterval(this.interval);
    emptyCurrentVideoSlot();
    const authorization = auth();
    const authExists = !!authorization.headers.authorization;
    if (authExists) {
      try {
        request.put(
          `${VIDEO_URL}/currentlyWatching`,
          { videoId: null },
          authorization
        );
      } catch (error) {
        console.error(error.response || error);
      }
    }
  };

  increaseProgress = async() => {
    const { justEarned, xpEarned, timeWatched, totalDuration } = this.state;
    const { changeUserXP, difficulty, twinkleXP, videoId } = this.props;
    if (!!difficulty && !xpEarned && !justEarned && this.Player) {
      if (this.Player.getInternalPlayer()) {
        if (this.Player.getInternalPlayer().isMuted()) {
          this.Player.getInternalPlayer().unMute();
        }
        if (this.Player.getInternalPlayer().getVolume() < 30) {
          this.Player.getInternalPlayer().setVolume(30);
        }
      }
    }
    let requiredViewDuration =
      totalDuration < requiredDurationCap(twinkleXP)
        ? totalDuration - 3
        : requiredDurationCap(twinkleXP);
    if (
      !!difficulty &&
      timeWatched >= requiredViewDuration &&
      !this.rewardingXP
    ) {
      this.rewardingXP = true;
      try {
        await request.put(`${VIDEO_URL}/xpEarned`, { videoId }, auth());
        await changeUserXP({
          type: 'increase',
          action: 'watch',
          target: 'video',
          targetId: videoId,
          amount: difficulty * xp
        });
        if (this.mounted) {
          this.setState(() => ({
            justEarned: true
          }));
        }
        this.rewardingXP = false;
      } catch (error) {
        console.error(error.response || error);
      }
    }
    if (!xpEarned && this.mounted) {
      this.setState(state => ({
        timeWatched: state.timeWatched + intervalLength / 1000
      }));
    }
    const authorization = auth();
    const authExists = !!authorization.headers.authorization;
    if (authExists) {
      try {
        const {
          data: { currentlyWatchingAnotherVideo, success }
        } = await request.put(
          `${VIDEO_URL}/duration`,
          { videoId, difficulty, xpEarned },
          authorization
        );
        if (success) return;
        if (currentlyWatchingAnotherVideo) {
          if (this.Player) {
            if (this.Player.getInternalPlayer()) {
              this.Player.getInternalPlayer().pauseVideo();
            }
          }
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
  };
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    userId: state.UserReducer.userId,
    pageVisible: state.ViewReducer.pageVisible,
    currentVideoSlot: state.VideoReducer.currentVideoSlot,
    twinkleXP: state.UserReducer.twinkleXP
  }),
  {
    addVideoView,
    changeUserXP,
    fillCurrentVideoSlot,
    emptyCurrentVideoSlot
  }
)(VideoPlayer);
