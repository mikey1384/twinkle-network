import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel';
import VideoThumb from 'components/VideoThumb';
import DropdownButton from 'components/Buttons/DropdownButton';
import EditTitleForm from 'components/Texts/EditTitleForm';
import EditPlaylistModal from './Modals/EditPlaylistModal';
import PlaylistModal from 'components/Modals/PlaylistModal';
import ConfirmModal from 'components/Modals/ConfirmModal';
import Link from 'components/Link';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';
import { charLimit } from 'constants/defaultValues';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { cleanString } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useExploreContext } from 'contexts';

PlaylistCarousel.propTypes = {
  userIsUploader: PropTypes.bool,
  id: PropTypes.number.isRequired,
  playlist: PropTypes.array.isRequired,
  showAllButton: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  uploader: PropTypes.string.isRequired,
  numPlaylistVids: PropTypes.number.isRequired
};

const defaultNumSlides = 5;
const mobileNumSlides = 4;
const cellSpacing = 12;

export default function PlaylistCarousel({
  id: playlistId,
  numPlaylistVids,
  playlist,
  showAllButton,
  title,
  uploader,
  userIsUploader
}) {
  const {
    requestHelpers: { deletePlaylist, editPlaylistTitle }
  } = useAppContext();
  const { canEdit, canEditPlaylists, profileTheme } = useMyState();
  const {
    state: {
      videos: { clickSafe }
    },
    actions: { onDeletePlaylist, onEditPlaylistTitle }
  } = useExploreContext();
  const [onEdit, setOnEdit] = useState(false);
  const [changePLVideosModalShown, setChangePLVideosModalShown] = useState(
    false
  );
  const [reorderPLVideosModalShown, setReorderPLVideosModalShown] = useState(
    false
  );
  const [deleteConfirmModalShown, setDeleteConfirmModalShown] = useState(false);
  const [playlistModalShown, setPlaylistModalShown] = useState(false);
  const [numSlides, setNumSlides] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.clientWidth <= 991
      ? mobileNumSlides
      : defaultNumSlides
  );

  useEffect(() => {
    addEvent(window, 'resize', onResize);
    function onResize() {
      setNumSlides(
        document.documentElement.clientWidth <= 991
          ? mobileNumSlides
          : defaultNumSlides
      );
    }

    return function cleanUp() {
      removeEvent(window, 'resize', onResize);
    };
  });

  return (
    <div
      className={css`
        margin-bottom: 1.5rem;
        &:last-child {
          margin-bottom: 0;
        }
      `}
    >
      <div
        className={css`
          position: relative;
          display: flex;
          align-items: center;
          padding-bottom: 0.8rem;
          p {
            font-size: 2.2rem;
            font-weight: bold;
            cursor: pointer;
            display: inline;
            > a {
              color: ${Color.darkGray()};
              text-decoration: none;
              &:hover {
                transition: color 0.3s;
                color: ${Color[profileTheme]()};
              }
            }
          }
          small {
            font-size: 1.5rem;
            color: ${Color.gray()};
          }
        `}
      >
        {onEdit ? (
          <EditTitleForm
            autoFocus
            maxLength={charLimit.playlist.title}
            style={{ width: '90%' }}
            title={title}
            onEditSubmit={handleEditedTitleSubmit}
            onClickOutSide={() => setOnEdit(false)}
          />
        ) : (
          <div>
            <p>
              <Link to={`/playlists/${playlistId}`}>{cleanString(title)}</Link>
              &nbsp;
              <small>by {uploader}</small>
            </p>
          </div>
        )}
        {!onEdit && (userIsUploader || canEditPlaylists || canEdit) && (
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            style={{ position: 'absolute', right: 0 }}
            direction="left"
            menuProps={[
              {
                label: 'Edit Title',
                onClick: () => setOnEdit(true)
              },
              {
                label: 'Change Videos',
                onClick: () => setChangePLVideosModalShown(true)
              },
              {
                label: 'Reorder Videos',
                onClick: () => setReorderPLVideosModalShown(true)
              },
              {
                separator: true
              },
              {
                label: 'Remove Playlist',
                onClick: () => setDeleteConfirmModalShown(true)
              }
            ]}
          />
        )}
      </div>
      <Carousel
        progressBar={false}
        slidesToShow={numSlides}
        slidesToScroll={numSlides}
        cellSpacing={cellSpacing}
        slideWidthMultiplier={0.99}
        showAllButton={showAllButton}
        onShowAll={() => setPlaylistModalShown(true)}
      >
        {renderThumbs()}
      </Carousel>
      {playlistModalShown && (
        <PlaylistModal
          title={cleanString(title)}
          onHide={() => setPlaylistModalShown(false)}
          playlistId={playlistId}
        />
      )}
      {changePLVideosModalShown && (
        <EditPlaylistModal
          modalType="change"
          numPlaylistVids={numPlaylistVids}
          playlistId={playlistId}
          onHide={() => setChangePLVideosModalShown(false)}
        />
      )}
      {reorderPLVideosModalShown && (
        <EditPlaylistModal
          modalType="reorder"
          numPlaylistVids={numPlaylistVids}
          playlistId={playlistId}
          onHide={() => setReorderPLVideosModalShown(false)}
        />
      )}
      {deleteConfirmModalShown && (
        <ConfirmModal
          title="Remove Playlist"
          onConfirm={handleDeleteConfirm}
          onHide={() => setDeleteConfirmModalShown(false)}
        />
      )}
    </div>
  );

  function renderThumbs() {
    return playlist.map((thumb, index) => {
      return (
        <VideoThumb
          className={css`
            @media (max-width: ${mobileMaxWidth}) {
              a {
                font-size: 1.3rem;
              }
              .username {
                font-size: 1rem;
              }
            }
          `}
          to={`videos/${thumb.videoId}?playlist=${playlistId}`}
          clickSafe={clickSafe}
          key={index}
          video={{
            id: thumb.videoId,
            byUser: thumb.byUser,
            content: thumb.content,
            rewardLevel: thumb.rewardLevel,
            title: thumb.video_title,
            description: thumb.video_description,
            uploaderName: thumb.video_uploader,
            likes: thumb.likes
          }}
          user={{ username: thumb.video_uploader, id: thumb.video_uploader_id }}
        />
      );
    });
  }

  async function handleEditedTitleSubmit(title) {
    await editPlaylistTitle({ title, playlistId });
    onEditPlaylistTitle({ playlistId, title });
    setOnEdit(false);
  }

  async function handleDeleteConfirm() {
    setDeleteConfirmModalShown(false);
    await deletePlaylist(playlistId);
    onDeletePlaylist(playlistId);
  }
}
