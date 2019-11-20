import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import PlaylistModal from 'components/Modals/PlaylistModal';
import TagModal from './TagModal';
import { hashify } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

TagStatus.propTypes = {
  onAddTags: PropTypes.func.isRequired,
  onAddTagToContents: PropTypes.func,
  onLoadTags: PropTypes.func,
  contentId: PropTypes.number.isRequired,
  style: PropTypes.object,
  tags: PropTypes.array.isRequired
};

export default function TagStatus({
  contentId,
  onAddTags,
  onAddTagToContents,
  onLoadTags,
  style,
  tags
}) {
  const {
    requestHelpers: { fetchPlaylistsContaining }
  } = useAppContext();
  const { canEditPlaylists } = useMyState();
  const [shownPlaylistId, setShownPlaylistId] = useState();
  const [shownPlaylistTitle, setShownPlaylistTitle] = useState('');
  const [tagModalShown, setTagModalShown] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (onLoadTags) {
      loadTags();
    }
    async function loadTags() {
      const tags = await fetchPlaylistsContaining({ videoId: contentId });
      if (mounted.current) {
        onLoadTags({ tags, contentId, contentType: 'video' });
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  const tagIds = useMemo(() => {
    return tags.map(tag => tag.id);
  }, [tags]);

  const Tags = useMemo(
    () =>
      tags.map(tag => (
        <a
          style={{ marginRight: '0.5rem' }}
          key={tag.id}
          onClick={() => {
            setShownPlaylistId(tag.id);
            setShownPlaylistTitle(tag.title);
          }}
        >
          {hashify(tag.title)}
        </a>
      )),
    [tags]
  );

  return (
    <div
      style={style}
      className={css`
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        a {
          font-weight: bold;
          cursor: pointer;
        }
      `}
    >
      {(tags.length > 0 || canEditPlaylists) && (
        <div style={{ padding: '0 1rem' }}>
          {Tags}
          {canEditPlaylists && (
            <a
              style={{
                color: tags.length > 0 ? Color.orange() : Color.blue()
              }}
              onClick={() => setTagModalShown(true)}
            >
              +Add
              {tags.length === 0 ? ' to Playlists' : ''}
            </a>
          )}
        </div>
      )}
      {tagModalShown && (
        <TagModal
          currentPlaylists={tagIds}
          title="Add Video to Playlists"
          onHide={() => setTagModalShown(false)}
          onAddPlaylist={({ videoIds, playlistId, playlistTitle }) =>
            onAddTagToContents?.({
              contentIds: videoIds,
              contentType: 'video',
              tagId: playlistId,
              tagTitle: playlistTitle
            })
          }
          onSubmit={onTagSubmit}
          videoId={contentId}
        />
      )}
      {shownPlaylistId && (
        <PlaylistModal
          onLinkClick={() => setShownPlaylistId(undefined)}
          title={shownPlaylistTitle}
          playlistId={shownPlaylistId}
          onHide={() => {
            setShownPlaylistId(undefined);
            setShownPlaylistTitle('');
          }}
        />
      )}
    </div>
  );

  function onTagSubmit(selectedTags) {
    onAddTags({ tags: selectedTags, contentType: 'video', contentId });
    setTagModalShown(false);
  }
}
