import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { Color, mobileMaxWidth } from 'constants/css';
import { cleanString, queryStringForArray } from 'helpers/stringHelpers';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import VideoThumbImage from 'components/VideoThumbImage';
import FilterBar from 'components/FilterBar';
import Notification from 'components/Notification';
import request from 'axios';
import URL from 'constants/URL';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useNotiContext } from 'contexts';

NavMenu.propTypes = {
  playlistId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  videoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default function NavMenu({ playlistId, videoId }) {
  const {
    requestHelpers: { fetchNotifications }
  } = useAppContext();
  const { profileTheme, userId } = useMyState();
  const {
    state: { numNewNotis, totalRewardAmount },
    actions: { onClearNotifications, onFetchNotifications }
  } = useNotiContext();
  const [nextVideos, setNextVideos] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [otherVideos, setOtherVideos] = useState([]);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [rewardsExist, setRewardsExist] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState();
  const [playlistVideosLoading, setPlaylistVideosLoading] = useState(false);
  const [
    playlistVideosLoadMoreShown,
    setPlaylistVideosLoadMoreShown
  ] = useState(false);
  const [videoTabActive, setVideoTabActive] = useState(true);
  const mounted = useRef(true);
  const prevUserId = useRef(userId);

  useEffect(() => {
    mounted.current = true;
    socket.on('new_reward', handleFetchNotifications);
    loadRightMenuVideos();
    async function loadRightMenuVideos() {
      try {
        const { data } = await request.get(
          `${URL}/${
            playlistId ? 'playlist' : 'video'
          }/rightMenu?videoId=${videoId}${
            playlistId ? `&playlistId=${playlistId}` : ''
          }`
        );
        if (mounted.current) {
          if (data.playlistTitle) {
            setPlaylistTitle(data.playlistTitle);
          }
          if (data.nextVideos) {
            setNextVideos(data.nextVideos);
          }
          if (data.relatedVideos) {
            setRelatedVideos(data.relatedVideos);
          }
          if (data.playlistVideos) {
            setPlaylistVideos(data.playlistVideos);
          }
          if (data.playlistVideosLoadMoreShown) {
            setPlaylistVideosLoadMoreShown(data.playlistVideosLoadMoreShown);
          }
          if (data.otherVideos) {
            setOtherVideos(data.otherVideos);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    return function cleanUp() {
      socket.removeListener('new_reward', handleFetchNotifications);
      mounted.current = false;
    };
  }, [videoId]);

  useEffect(() => {
    setRewardsExist(totalRewardAmount > 0);
  }, [totalRewardAmount]);

  useEffect(() => {
    if (prevUserId.current !== userId) {
      onClearNotifications();
    }
    prevUserId.current = userId;
  }, [userId]);

  return useMemo(
    () => (
      <ErrorBoundary
        className={css`
          width: CALC(30% - 2rem);
          font-size: 2rem;
          margin-right: 1rem;
          > section {
            padding: 1rem;
            background: #fff;
            border: 1px solid ${Color.borderGray()};
            margin-bottom: 1rem;
            p {
              margin-bottom: 1rem;
              font-size: 2.5rem;
              font-weight: bold;
            }
            a {
              font-size: 1.7rem;
              font-weight: bold;
              line-height: 1.7rem;
            }
          }
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin: 0;
            section {
              margin: 0;
            }
          }
        `}
      >
        <FilterBar
          style={{
            border: `1px solid ${Color.borderGray()}`,
            borderBottom: 0
          }}
          className="desktop"
        >
          <nav
            className={videoTabActive ? 'active' : ''}
            onClick={() => setVideoTabActive(true)}
          >
            Videos
          </nav>
          <nav
            className={`${!videoTabActive ? 'active' : ''} ${
              rewardsExist || numNewNotis > 0 ? 'alert' : ''
            }`}
            onClick={() => setVideoTabActive(false)}
          >
            {rewardsExist ? 'Rewards' : 'News'}
          </nav>
        </FilterBar>
        {videoTabActive && (
          <>
            {nextVideos.length > 0 && (
              <section key={videoId + 'up next'}>
                <p>Up Next</p>
                {renderVideos({
                  videos: nextVideos,
                  arePlaylistVideos: playlistId && playlistVideos.length > 0
                })}
              </section>
            )}
            {playlistId && playlistVideos.length > 0 && (
              <section
                key={videoId + 'playlist videos'}
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <Link
                    style={{
                      fontSize: '2.5rem',
                      textDecoration: 'none'
                    }}
                    to={`/playlists/${playlistId}`}
                  >
                    {cleanString(playlistTitle)}
                  </Link>
                </div>
                {renderVideos({
                  videos: playlistVideos,
                  arePlaylistVideos: true
                })}
                {playlistVideosLoadMoreShown && (
                  <LoadMoreButton
                    loading={playlistVideosLoading}
                    onClick={loadMorePlaylistVideos}
                    color="green"
                    filled
                    style={{ marginTop: '1.5rem', width: '100%' }}
                  />
                )}
              </section>
            )}
            {relatedVideos.length > 0 && (
              <section key={videoId + 'related videos'}>
                <p>Related Videos</p>
                {renderVideos({ videos: relatedVideos })}
              </section>
            )}
            {otherVideos.length > 0 && (
              <section key={videoId + 'new videos'}>
                <p>New Videos</p>
                {renderVideos({ videos: otherVideos })}
              </section>
            )}
          </>
        )}
        {!videoTabActive && <Notification style={{ paddingTop: 0 }} />}
      </ErrorBoundary>
    ),
    [
      numNewNotis,
      playlistId,
      profileTheme,
      userId,
      videoId,
      nextVideos,
      relatedVideos,
      otherVideos,
      playlistVideos,
      rewardsExist,
      playlistTitle,
      playlistVideosLoading,
      playlistVideosLoadMoreShown,
      videoTabActive
    ]
  );

  async function handleFetchNotifications() {
    const data = await fetchNotifications();
    onFetchNotifications(data);
  }

  async function loadMorePlaylistVideos() {
    setPlaylistVideosLoading(true);
    const shownVideos = queryStringForArray({
      array: playlistVideos,
      originVar: 'videoId',
      destinationVar: 'shownVideos'
    });
    try {
      const {
        data: {
          playlistVideos: newPlaylistVideos,
          playlistVideosLoadMoreShown: shown
        }
      } = await request.get(
        `${URL}/video/more/playlistVideos?videoId=${videoId}&playlistId=${playlistId}&${shownVideos}`
      );
      setPlaylistVideosLoading(false);
      setPlaylistVideos(playlistVideos.concat(newPlaylistVideos));
      setPlaylistVideosLoadMoreShown(shown);
    } catch (error) {
      console.error(error);
    }
  }

  function renderVideos({ videos, arePlaylistVideos }) {
    return videos.map((video, index) => (
      <div
        key={video.id}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          width: '100%',
          marginTop: index !== 0 ? '1rem' : 0
        }}
      >
        <div style={{ width: '50%' }}>
          <Link
            to={`/videos/${video.videoId}${
              arePlaylistVideos ? `?playlist=${playlistId}` : ''
            }`}
          >
            <VideoThumbImage
              rewardLevel={video.rewardLevel}
              videoId={video.videoId}
              src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
            />
          </Link>
        </div>
        <div
          style={{
            paddingLeft: '1rem',
            width: '50%',
            lineHeight: 1.1,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            marginTop: '-0.5rem'
          }}
        >
          <Link
            to={`/videos/${video.videoId}${
              arePlaylistVideos ? `?playlist=${playlistId}` : ''
            }`}
            style={{
              color: video.byUser ? Color[profileTheme](0.9) : Color.blue()
            }}
          >
            {cleanString(video.title)}
          </Link>
          <small
            style={{
              color: Color.gray(),
              display: 'block',
              fontSize: '1.3rem',
              marginTop: '1rem'
            }}
          >
            Uploaded by {video.username}
          </small>
        </div>
      </div>
    ));
  }
}
