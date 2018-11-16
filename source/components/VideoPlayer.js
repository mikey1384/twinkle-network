import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Color } from 'constants/css';
import { connect } from 'react-redux';
import { auth } from 'helpers/requestHelpers';
import {
  addVideoView,
  fillCurrentVideoSlot,
  emptyCurrentVideoSlot
} from 'redux/actions/VideoActions';
import { changeUserXP } from 'redux/actions/UserActions';
import request from 'axios';
import StarMark from 'components/StarMark';
import { URL } from 'constants/URL';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { css } from 'emotion';

const CONTENT_URL = `${URL}/content`;
const VIDEO_URL = `${URL}/video`;
const intervalLength = 2000;
const denominator = 4;
const requiredDurationCap = 150;

class VideoPlayer extends Component {
  static propTypes = {
    addVideoView: PropTypes.func.isRequired,
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
  };

  interval = null;
  Player = null;
  rewardingXP = false;
  playing = false;

  state = {
    started: false,
    timeWatched: 0,
    totalDuration: 0,
    xpEarned: false,
    justEarned: false,
    imageUrl: ''
  };

  async componentDidMount() {
    const { hasHqThumb, isStarred, userId, videoCode, videoId } = this.props;
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

    if (isStarred && userId) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        );
        if (this.mounted) this.setState(() => ({ xpEarned: !!xpEarned }));
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
      isStarred,
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
        justEarned: false
      }));
    }

    if (prevProps.videoCode !== videoCode) {
      const newImageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
      this.setState({
        imageUrl: `https://img.youtube.com/vi/${videoCode}/${newImageName}.jpg`
      });
    }

    if (isStarred && userId && userId !== prevProps.userId) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        );
        if (xpEarned && this.mounted) {
          this.setState(() => ({ xpEarned: !!xpEarned }));
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
      isStarred &&
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
      isStarred &&
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
      isStarred,
      minimized,
      stretch,
      onEdit,
      videoCode,
      style = {},
      userId
    } = this.props;
    const {
      imageUrl,
      started,
      timeWatched,
      totalDuration,
      xpEarned,
      justEarned
    } = this.state;
    const requiredViewDuration = Math.min(
      totalDuration / denominator,
      requiredDurationCap
    );
    const progress = xpEarned
      ? 100
      : requiredViewDuration > 0
        ? Math.floor(
            (Math.min(timeWatched, requiredViewDuration) * 100) /
              requiredViewDuration
          )
        : 0;
    return (
      <ErrorBoundary style={style}>
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
          {!minimized &&
            !started && (
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
                {isStarred && (
                  <StarMark
                    style={{
                      top: '1rem',
                      left: '1rem'
                    }}
                  />
                )}
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
        {(!started || xpEarned) && (
          <div
            style={{
              background: xpEarned ? Color.green() : Color.logoBlue(),
              padding: '0.5rem',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {!xpEarned && <Icon icon="star" />}
            {xpEarned
              ? 'You have already earned XP from this video'
              : ' Watch this video and get 100XP'}
          </div>
        )}
        {!xpEarned &&
          isStarred &&
          userId &&
          started && (
            <ProgressBar
              progress={progress}
              noBorderRadius={stretch}
              color={justEarned ? Color.green() : Color.blue()}
              text={justEarned ? 'Earned 100 XP!' : ''}
            />
          )}
      </ErrorBoundary>
    );
  }

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
      isStarred,
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
      if (authExists && isStarred && !(justEarned || xpEarned)) {
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
    const { changeUserXP, isStarred, videoId } = this.props;
    if (isStarred && !xpEarned && !justEarned && this.Player) {
      if (this.Player.getInternalPlayer()) {
        if (this.Player.getInternalPlayer().isMuted()) {
          this.Player.getInternalPlayer().unMute();
        }
        if (this.Player.getInternalPlayer().getVolume() < 30) {
          this.Player.getInternalPlayer().setVolume(30);
        }
      }
    }
    if (
      isStarred &&
      timeWatched >=
        Math.min(totalDuration / denominator, requiredDurationCap) &&
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
          amount: 100
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
          { videoId, isStarred, xpEarned },
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
    currentVideoSlot: state.VideoReducer.currentVideoSlot
  }),
  {
    addVideoView,
    changeUserXP,
    fillCurrentVideoSlot,
    emptyCurrentVideoSlot
  }
)(VideoPlayer);
