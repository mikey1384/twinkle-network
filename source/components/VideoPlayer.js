import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { connect } from 'react-redux';
import { addCommasToNumber } from 'helpers/stringHelpers';
import {
  addVideoView,
  fillCurrentVideoSlot,
  emptyCurrentVideoSlot
} from 'redux/actions/VideoActions';
import { css } from 'emotion';
import { rewardValue } from 'constants/defaultValues';
import { useAppContext } from 'context';

const intervalLength = 2000;
const xp = rewardValue.star;

VideoPlayer.propTypes = {
  addVideoView: PropTypes.func.isRequired,
  byUser: PropTypes.bool,
  currentVideoSlot: PropTypes.number,
  emptyCurrentVideoSlot: PropTypes.func,
  fillCurrentVideoSlot: PropTypes.func,
  hasHqThumb: PropTypes.number,
  minimized: PropTypes.bool,
  stretch: PropTypes.bool,
  onEdit: PropTypes.bool,
  rewardLevel: PropTypes.number,
  style: PropTypes.object,
  uploader: PropTypes.object.isRequired,
  videoCode: PropTypes.string.isRequired,
  videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function VideoPlayer({
  addVideoView,
  byUser,
  currentVideoSlot,
  emptyCurrentVideoSlot,
  fillCurrentVideoSlot,
  rewardLevel,
  hasHqThumb,
  minimized,
  onEdit,
  stretch,
  style = {},
  uploader,
  videoCode,
  videoId
}) {
  const {
    user: {
      actions: { onChangeUserXP },
      state: { profileTheme, twinkleXP, userId }
    },
    requestHelpers: {
      checkXPEarned,
      fetchVideoThumbUrl,
      updateCurrentlyWatching,
      updateUserXP,
      updateTotalViewDuration,
      updateVideoXPEarned
    },
    view: {
      state: { pageVisible }
    }
  } = useAppContext();
  const maxRequiredDuration = 250;
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [xpLoaded, setXpLoaded] = useState(false);
  const [xpEarned, setXpEarned] = useState(false);
  const [justEarned, setJustEarned] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [playerShown, setPlayerShown] = useState(false);
  const requiredDurationCap = useRef(maxRequiredDuration);
  const PlayerRef = useRef(null);
  const timerRef = useRef(null);
  const timeWatchedRef = useRef(0);
  const totalDurationRef = useRef(0);
  const watchCodeRef = useRef(Math.floor(Math.random() * 10000));
  const mounted = useRef(true);
  const rewardingXP = useRef(false);
  const themeColor = profileTheme || 'logoBlue';
  const rewardAmountRef = useRef(rewardLevel * xp);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      onVideoStop();
      clearInterval(timerRef.current);
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
    const userIsLevel2 = twinkleXP >= 2000000;
    requiredDurationCap.current = userIsLevel2
      ? Math.min(twinkleXP / 10000, maxRequiredDuration)
      : 60 + Math.min(twinkleXP / 1000, 120) || maxRequiredDuration;
  }, [userId]);

  useEffect(() => {
    rewardAmountRef.current = rewardLevel * xp;
    if (videoCode && typeof hasHqThumb !== 'number') {
      fetchVideoThumb();
    } else {
      const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
      setImageUrl(`https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`);
    }

    if (!!rewardLevel && userId) {
      handleCheckXPEarned();
    }

    async function handleCheckXPEarned() {
      const xpEarned = await checkXPEarned(videoId);
      if (mounted.current) {
        setXpEarned(!!xpEarned);
        setXpLoaded(true);
      }
    }

    async function fetchVideoThumb() {
      const thumbUrl = await fetchVideoThumbUrl({ videoCode, videoId });
      if (mounted.current) {
        setImageUrl(thumbUrl);
      }
    }
  }, [rewardLevel, userId]);

  useEffect(() => {
    if (onEdit === true) onVideoStop();
    setStarted(false);
  }, [onEdit]);

  useEffect(() => {
    clearInterval(timerRef.current);
  }, [justEarned]);

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
      PlayerRef.current.getInternalPlayer()?.pauseVideo?.();
    }
  }, [currentVideoSlot]);

  useEffect(() => {
    const alreadyEarned = xpEarned || justEarned;
    if (started && !!rewardLevel && userId && !alreadyEarned) {
      onVideoStop();
      PlayerRef.current.getInternalPlayer()?.pauseVideo?.();
    }
  }, [pageVisible]);

  const meterColor = xpEarned
    ? Color.green()
    : rewardLevel === 5
    ? Color.gold()
    : rewardLevel === 4
    ? Color.brownOrange()
    : rewardLevel === 3
    ? Color.orange()
    : rewardLevel === 2
    ? Color.pink()
    : Color.logoBlue();
  return (
    <ErrorBoundary style={style}>
      {byUser && (
        <div
          style={{
            background: Color[themeColor](0.9),
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
            onPlay={() => onVideoPlay(requiredDurationCap.current)}
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
      {(!userId || xpLoaded) && !!rewardLevel && (!started || xpEarned) && (
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
              {[...Array(rewardLevel)].map((elem, index) => (
                <Icon key={index} icon="star" />
              ))}
            </div>
          )}
          <div style={{ marginLeft: !xpEarned ? '0.7rem' : 0 }}>
            {xpEarned
              ? 'You have already earned XP from this video'
              : ` Watch this video and earn ${addCommasToNumber(
                  rewardLevel * xp
                )} XP`}
          </div>
        </div>
      )}
      {!xpEarned && !!rewardLevel && userId && started && (
        <ProgressBar
          progress={progress}
          noBorderRadius={stretch}
          color={justEarned ? Color.green() : meterColor}
          text={
            justEarned
              ? `Earned ${addCommasToNumber(rewardLevel * xp)} XP!`
              : ''
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

  function onVideoPlay(requiredDurationCap) {
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
        timerRef.current = setInterval(
          () => increaseProgress(requiredDurationCap),
          intervalLength
        );
      }
    }
    if (!!rewardLevel && !(justEarned || xpEarned)) {
      updateCurrentlyWatching({
        watchCode: watchCodeRef.current
      });
    }
  }

  function onVideoStop() {
    setPlaying(false);
    clearInterval(timerRef.current);
    emptyCurrentVideoSlot();
  }

  async function increaseProgress(requiredDurationCap) {
    if (!!rewardLevel && !xpEarned && !justEarned) {
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
      rewardAmountRef.current &&
      timeWatchedRef.current >= requiredViewDuration &&
      !rewardingXP.current &&
      (!justEarned || xpEarned)
    ) {
      rewardingXP.current = true;
      try {
        await updateVideoXPEarned(videoId);
        const { alreadyDone, xp, rank } = await updateUserXP({
          action: 'watch',
          target: 'video',
          amount: rewardAmountRef.current,
          targetId: videoId,
          type: 'increase'
        });
        if (alreadyDone) return;
        onChangeUserXP({ xp, rank });
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
    const {
      notLoggedIn,
      success,
      currentlyWatchingAnotherVideo
    } = await updateTotalViewDuration({
      videoId,
      rewardLevel,
      xpEarned,
      watchCode: watchCodeRef.current
    });
    if (success || notLoggedIn) return;
    if (
      currentlyWatchingAnotherVideo &&
      !xpEarned &&
      !!rewardLevel &&
      !justEarned
    ) {
      PlayerRef.current.getInternalPlayer()?.pauseVideo?.();
    }
  }
}

export default connect(
  state => ({
    currentVideoSlot: state.VideoReducer.currentVideoSlot
  }),
  {
    addVideoView,
    fillCurrentVideoSlot,
    emptyCurrentVideoSlot
  }
)(VideoPlayer);
