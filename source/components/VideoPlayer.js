import React, { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Spinner from 'components/Spinner';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { rewardValue } from 'constants/defaultValues';
import {
  useAppContext,
  useContentContext,
  useExploreContext,
  useViewContext
} from 'contexts';

const intervalLength = 2000;
const xp = rewardValue.star;

VideoPlayer.propTypes = {
  byUser: PropTypes.bool,
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
  byUser,
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
      addVideoView,
      checkXPEarned,
      fetchVideoThumbUrl,
      updateCurrentlyWatching,
      updateUserXP,
      updateTotalViewDuration,
      updateVideoXPEarned
    }
  } = useAppContext();
  const {
    state: {
      videos: { currentVideoSlot }
    },
    actions: { onEmptyCurrentVideoSlot, onFillCurrentVideoSlot }
  } = useExploreContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const {
    state,
    actions: {
      onSetVideoImageUrl,
      onSetVideoPlaying,
      onSetVideoStarted,
      onSetVideoXpEarned,
      onSetVideoXpJustEarned,
      onSetVideoXpLoaded,
      onSetVideoXpProgress,
      onSetXpVideoWatchTime,
      onSetVideoCurrentTime
    }
  } = useContentContext();
  const contentState = state['video' + videoId] || {};
  const {
    currentTime = 0,
    playing,
    started,
    xpLoaded,
    xpEarned,
    justEarned,
    imageUrl = '',
    progress = 0,
    watchTime = 0
  } = contentState;
  const [playerShown, setPlayerShown] = useState(false);
  const [alreadyEarned, setAlreadyEarned] = useState(false);
  const maxRequiredDuration = 250;
  const requiredDurationCap = useRef(maxRequiredDuration);
  const PlayerRef = useRef(null);
  const startPositionRef = useRef(0);
  const timerRef = useRef(null);
  const timeWatchedRef = useRef(0);
  const totalDurationRef = useRef(0);
  const userIdRef = useRef(null);
  const watchCodeRef = useRef(Math.floor(Math.random() * 10000));
  const mounted = useRef(true);
  const rewardingXP = useRef(false);
  const themeColor = profileTheme || 'logoBlue';
  const rewardAmountRef = useRef(rewardLevel * xp);
  useEffect(() => {
    mounted.current = true;
    startPositionRef.current = currentTime;
    timeWatchedRef.current = watchTime;
    return function cleanUp() {
      onVideoStop();
      onSetVideoStarted({ videoId, started: false });
      clearInterval(timerRef.current);
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    return function setCurrentTimeBeforeUnmount() {
      onSetVideoCurrentTime({
        videoId,
        currentTime: justEarned
          ? 0
          : PlayerRef.current?.getInternalPlayer()?.getCurrentTime?.() || 0
      });
    };
  }, [justEarned]);

  useEffect(() => {
    PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
    const userIsLevel2 = twinkleXP >= 2000000;
    requiredDurationCap.current = userIsLevel2
      ? Math.min(twinkleXP / 10000, maxRequiredDuration)
      : 60 + Math.min(twinkleXP / 1000, 120) || maxRequiredDuration;
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    rewardAmountRef.current = rewardLevel * xp;
    if (!imageUrl && videoCode && typeof hasHqThumb !== 'number') {
      fetchVideoThumb();
    } else {
      const imageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
      onSetVideoImageUrl({
        videoId,
        url: `https://img.youtube.com/vi/${videoCode}/${imageName}.jpg`
      });
    }

    if (!!rewardLevel && userId && !xpLoaded) {
      handleCheckXPEarned();
    }

    async function handleCheckXPEarned() {
      const xpEarned = await checkXPEarned(videoId);
      if (mounted.current) {
        onSetVideoXpEarned({ videoId, earned: !!xpEarned });
        onSetVideoXpLoaded({ videoId, loaded: true });
      }
    }

    async function fetchVideoThumb() {
      const thumbUrl = await fetchVideoThumbUrl({ videoCode, videoId });
      if (mounted.current) {
        onSetVideoImageUrl({
          videoId,
          url: thumbUrl
        });
      }
    }
  }, [rewardLevel, userId]);

  useEffect(() => {
    if (onEdit === true) onVideoStop();
  }, [onEdit]);

  useEffect(() => {
    clearInterval(timerRef.current);
  }, [justEarned]);

  useEffect(() => {
    if (userId && xpEarned && !playing) {
      setAlreadyEarned(true);
    }
    if (!userId) {
      setAlreadyEarned(false);
      onSetVideoXpEarned({ videoId, earned: false });
      onSetVideoXpJustEarned({ videoId, justEarned: false });
      onSetVideoXpLoaded({ videoId, loaded: false });
    }
  }, [userId, xpEarned, playing]);

  useEffect(() => {
    const newImageName = hasHqThumb ? 'maxresdefault' : 'mqdefault';
    onSetVideoImageUrl({
      videoId,
      url: `https://img.youtube.com/vi/${videoCode}/${newImageName}.jpg`
    });
  }, [videoCode]);

  useEffect(() => {
    const userWatchingMultipleVideo =
      currentVideoSlot && currentVideoSlot !== watchCodeRef.current;
    if (started && userWatchingMultipleVideo) {
      onVideoStop();
      PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
    }
  }, [currentVideoSlot]);

  useEffect(() => {
    const alreadyEarned = xpEarned || justEarned;
    if (started && !!rewardLevel && userId && !alreadyEarned) {
      onVideoStop();
      PlayerRef.current?.getInternalPlayer()?.pauseVideo?.();
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
  const videoUrl = `https://www.youtube.com/watch?v=${videoCode}${
    startPositionRef.current > 0 ? `?t=${startPositionRef.current}` : ''
  }`;

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
      >
        {!minimized && !started && (
          <>
            <img
              alt=""
              src={imageUrl}
              onTouchStart={() => setPlayerShown(true)}
              onMouseEnter={() => setPlayerShown(true)}
              onClick={() => setPlayerShown(true)}
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
            url={videoUrl}
            playing={playing}
            controls
            onReady={onVideoReady}
            onPlay={() =>
              onVideoPlay({
                requiredDurationCap: requiredDurationCap.current,
                userId: userIdRef.current
              })
            }
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
      {startPositionRef.current > 0 && !started ? (
        <div
          style={{
            background: Color.darkBlue(),
            padding: '0.5rem',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (!playerShown) {
              setPlayerShown(true);
            } else {
              PlayerRef.current?.getInternalPlayer()?.playVideo();
            }
          }}
        >
          Continue Watching...
        </div>
      ) : (
        (!userId || xpLoaded) &&
        !!rewardLevel &&
        (!started || alreadyEarned) && (
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
            {!alreadyEarned && (
              <div>
                {[...Array(rewardLevel)].map((elem, index) => (
                  <Icon key={index} icon="star" />
                ))}
              </div>
            )}
            <div style={{ marginLeft: '0.7rem' }}>
              {alreadyEarned
                ? 'You have already earned XP from this video'
                : `Watch this video and earn ${addCommasToNumber(
                    rewardLevel * xp
                  )} XP`}
            </div>
          </div>
        )
      )}
      {!alreadyEarned && !!rewardLevel && userId && started && (
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

  function onVideoPlay({ requiredDurationCap, userId }) {
    onSetVideoStarted({ videoId, started: true });
    if (!playing) {
      onSetVideoPlaying({ videoId, playing: true });
      const time = PlayerRef.current.getCurrentTime();
      if (Math.floor(time) === 0) {
        addVideoView({ videoId, userId });
      }
      if (!currentVideoSlot) {
        onFillCurrentVideoSlot(watchCodeRef.current);
      }
      clearInterval(timerRef.current);
      if (!xpEarned && !justEarned) {
        timerRef.current = setInterval(
          () => increaseProgress({ requiredDurationCap, userId }),
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
    onSetVideoPlaying({ videoId, playing: false });
    clearInterval(timerRef.current);
    onEmptyCurrentVideoSlot();
  }

  async function increaseProgress({ requiredDurationCap, userId }) {
    if (!totalDurationRef.current) {
      onVideoReady();
    }
    if (!!rewardLevel && !xpEarned && !justEarned && userId) {
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
      (!justEarned || xpEarned) &&
      userId
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
        onSetVideoXpJustEarned({ videoId, justEarned: true });
        onSetVideoXpEarned({ videoId, earned: true });
        rewardingXP.current = false;
      } catch (error) {
        console.error(error.response || error);
      }
    }
    if (!xpEarned && userId) {
      timeWatchedRef.current = timeWatchedRef.current + intervalLength / 1000;
      onSetXpVideoWatchTime({
        videoId,
        watchTime: timeWatchedRef.current
      });
      let requiredViewDuration =
        totalDurationRef.current < requiredDurationCap + 10
          ? Math.floor(totalDurationRef.current / 2) * 2 - 20
          : requiredDurationCap;
      onSetVideoXpProgress({
        videoId,
        progress:
          requiredViewDuration > 0
            ? Math.floor(
                (Math.min(timeWatchedRef.current, requiredViewDuration) * 100) /
                  requiredViewDuration
              )
            : 0
      });
    }
    if (userId) {
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
}

export default memo(VideoPlayer);
