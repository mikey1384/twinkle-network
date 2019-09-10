import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import PlaylistModal from 'components/Modals/PlaylistModal';
import TagModal from './TagModal';
import { hashify } from 'helpers/stringHelpers';
import { fetchPlaylistsContaining } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Color } from 'constants/css';

TagStatus.propTypes = {
  onAddTags: PropTypes.func.isRequired,
  onAddTagToContents: PropTypes.func,
  onLoadTags: PropTypes.func,
  canEditPlaylists: PropTypes.bool,
  contentId: PropTypes.number.isRequired,
  style: PropTypes.object,
  tags: PropTypes.array.isRequired
};

function TagStatus({
  canEditPlaylists,
  contentId,
  onAddTags,
  onAddTagToContents,
  onLoadTags,
  style,
  tags
}) {
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
  }, [contentId]);

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
          {tags.map(tag => (
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
          ))}
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
          currentPlaylists={tags.map(tag => tag.id)}
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

export default connect(state => ({
  canEditPlaylists: state.UserReducer.canEditPlaylists
}))(TagStatus);
