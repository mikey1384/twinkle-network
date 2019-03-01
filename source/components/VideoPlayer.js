import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import request from 'axios';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
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
import { css } from 'emotion';
import { rewardValue } from 'constants/defaultValues';
import URL from 'constants/URL';

const CONTENT_URL = `${URL}/content`;
const VIDEO_URL = `${URL}/video`;
const intervalLength = 2000;
const xp = rewardValue.star;

VideoPlayer.propTypes = {
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
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function VideoPlayer({
  addVideoView,
  byUser,
  changeUserXP,
  chatMode,
  currentVideoSlot,
  emptyCurrentVideoSlot,
  fillCurrentVideoSlot,
  difficulty,
  hasHqThumb,
  minimized,
  onEdit,
  pageVisible,
  stretch,
  style = {},
  twinkleXP,
  userId,
  uploader,
  videoCode,
  videoId
}) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [xpLoaded, setXpLoaded] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);
  const [justEarned, setJustEarned] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [playerShown, setPlayerShown] = useState(false);
  const PlayerRef = useRef(null);
  const timerRef = useRef(null);
  const timeWatchedRef = useRef(0);
  const totalDurationRef = useRef(0);
  const watchCodeRef = useRef(Math.floor(Math.random() * 10000));
  const mounted = useRef(true);
  const rewardingXP = useRef(false);
  const requiredDurationCap = 60 + Math.min(twinkleXP, 120000) / 1000;
  const rewardAmountRef = useRef(difficulty * xp);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      onVideoStop();
      clearInterval(timerRef.current);
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    rewardAmountRef.current = difficulty * xp;
    if (videoCode && typeof hasHqThumb !== 'number') {
      fetchVideoThumb();
    } else {
      const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
      setImageUrl(`https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`);
    }

    if (!!difficulty && userId) {
      checkXpEarned();
    }

    async function checkXpEarned() {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${VIDEO_URL}/xpEarned?videoId=${videoId}`,
          auth()
        );
        if (mounted.current) {
          setXpEarned(!!xpEarned);
          setXpLoaded(true);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }

    async function fetchVideoThumb() {
      try {
        const {
          data: { payload }
        } = await request.put(`${CONTENT_URL}/videoThumb`, {
          videoCode,
          videoId
        });
        if (mounted.current) {
          setImageUrl(
            payload || `https://img.youtube.com/vi/${videoCode}/mqdefault.jpg`
          );
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }, [difficulty, userId]);

  useEffect(() => {
    if (onEdit === true) onVideoStop();
    setStarted(false);
  }, [onEdit]);

  useEffect(() => {
    if (!userId) {
      timeWatchedRef.current = 0;
      setXpEarned(false);
      setJustEarned(false);
      setXpLoaded(false);
    }
  }, [userId]);

  useEffect(() => {
    const newImageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
    setImageUrl(`https://img.youtube.com/vi/${videoCode}/${newImageName}.jpg`);
  }, [videoCode]);

  useEffect(() => {
    const userWatchingMultipleVideo =
      currentVideoSlot && currentVideoSlot !== watchCodeRef.current;
    if (started && userWatchingMultipleVideo) {
      onVideoStop();
      PlayerRef.current.getInternalPlayer()?.pauseVideo();
    }
  }, [currentVideoSlot]);

  useEffect(() => {
    const alreadyEarned = xpEarned || justEarned;
    if (started && !!difficulty && userId && !alreadyEarned) {
      onVideoStop();
      PlayerRef.current.getInternalPlayer()?.pauseVideo();
    }
  }, [pageVisible, chatMode]);

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
            setStarted(true);
          }
        }}
      >
        {!minimized && !started && (
          <>
            <img
              alt=""
              src={imageUrl}
              onTouchStart={() => setPlayerShown(true)}
              onMouseEnter={() => setPlayerShown(true)}
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
        {!onEdit && (playerShown || started) && (
          <ReactPlayer
            ref={PlayerRef}
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
            onReady={onVideoReady}
            onPlay={onVideoPlay}
            onPause={onVideoStop}
            onEnded={onVideoStop}
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
          progress={progress}
          noBorderRadius={stretch}
          color={justEarned ? Color.green() : meterColor}
          text={
            justEarned ? `Earned ${addCommasToNumber(difficulty * xp)} XP!` : ''
          }
        />
      )}
    </ErrorBoundary>
  );

  function onVideoReady() {
    totalDurationRef.current = PlayerRef.current
      .getInternalPlayer()
      ?.getDuration();
  }

  function onVideoPlay() {
    console.log(rewardAmountRef.current);
    setStarted(true);
    if (!playing) {
      setPlaying(true);
      const time = PlayerRef.current.getCurrentTime();
      if (Math.floor(time) === 0) {
        addVideoView({ videoId, userId });
      }
      if (!currentVideoSlot) {
        fillCurrentVideoSlot(watchCodeRef.current);
      }
      if (userId) {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(increaseProgress, intervalLength);
      }
    }
    const authorization = auth();
    const authExists = !!authorization.headers.authorization;
    if (authExists && !!difficulty && !(justEarned || xpEarned)) {
      try {
        request.put(
          `${VIDEO_URL}/currentlyWatching`,
          { watchCode: watchCodeRef.current },
          authorization
        );
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }

  function onVideoStop() {
    setPlaying(false);
    clearInterval(timerRef.current);
    emptyCurrentVideoSlot();
  }

  async function increaseProgress() {
    if (!!difficulty && !xpEarned && !justEarned) {
      if (PlayerRef.current.getInternalPlayer()?.isMuted()) {
        PlayerRef.current.getInternalPlayer()?.unMute();
      }
      if (PlayerRef.current.getInternalPlayer()?.getVolume() < 30) {
        PlayerRef.current.getInternalPlayer()?.setVolume(30);
      }
    }
    let requiredViewDuration =
      totalDurationRef.current < requiredDurationCap + 10
        ? Math.floor(totalDurationRef.current / 2) * 2 - 20
        : requiredDurationCap;
    if (
      !!difficulty &&
      timeWatchedRef.current >= requiredViewDuration &&
      !rewardingXP.current
    ) {
      rewardingXP.current = true;
      try {
        await request.put(`${VIDEO_URL}/xpEarned`, { videoId }, auth());
        await changeUserXP({
          type: 'increase',
          action: 'watch',
          target: 'video',
          targetId: videoId,
          amount: rewardAmountRef.current
        });
        setJustEarned(true);
        rewardingXP.current = false;
      } catch (error) {
        console.error(error.response || error);
      }
    }
    if (!xpEarned) {
      timeWatchedRef.current = timeWatchedRef.current + intervalLength / 1000;
      let requiredViewDuration =
        totalDurationRef.current < requiredDurationCap + 10
          ? Math.floor(totalDurationRef.current / 2) * 2 - 20
          : requiredDurationCap;
      setProgress(
        xpEarned
          ? 100
          : requiredViewDuration > 0
          ? Math.floor(
              (Math.min(timeWatchedRef.current, requiredViewDuration) * 100) /
                requiredViewDuration
            )
          : 0
      );
    }
    const authorization = auth();
    const authExists = !!authorization.headers.authorization;
    if (authExists) {
      try {
        const {
          data: { currentlyWatchingAnotherVideo, success }
        } = await request.put(
          `${VIDEO_URL}/duration`,
          {
            videoId,
            difficulty,
            xpEarned,
            watchCode: watchCodeRef.current
          },
          authorization
        );
        if (success) return;
        if (
          currentlyWatchingAnotherVideo &&
          !xpEarned &&
          !!difficulty &&
          !justEarned
        ) {
          PlayerRef.current.getInternalPlayer()?.pauseVideo();
        }
      } catch (error) {
        console.error(error.response || error);
      }
    }
  }
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
