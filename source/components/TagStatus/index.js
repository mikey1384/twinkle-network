import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlaylistModal from 'components/Modals/PlaylistModal';
import TagModal from './TagModal';
import { hashfy } from 'helpers/stringHelpers';
import { fetchPlaylistsContaining } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Color } from 'constants/css';

class TagStatus extends Component {
  mounted = false;
  state = {
    shownPlaylistId: null,
    shownPlaylistTitle: '',
    playlists: [],
    tagModalShown: false
  };

  static propTypes = {
    onAddTags: PropTypes.func.isRequired,
    onAddTagToContents: PropTypes.func,
    onLoadTags: PropTypes.func.isRequired,
    canEditPlaylists: PropTypes.bool,
    contentId: PropTypes.number.isRequired,
    style: PropTypes.object,
    tags: PropTypes.array.isRequired
  };

  async componentDidMount() {
    const { onLoadTags, contentId } = this.props;
    this.mounted = true;
    const playlists = await fetchPlaylistsContaining({ videoId: contentId });
    onLoadTags({ tags: playlists, contentId, type: 'video' });
  }

  async componentDidUpdate(prevProps) {
    const { onLoadTags, contentId } = this.props;
    if (contentId !== prevProps.contentId) {
      const playlists = await fetchPlaylistsContaining({ videoId: contentId });
      onLoadTags({ tags: playlists, contentId, type: 'video' });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { shownPlaylistId, shownPlaylistTitle, tagModalShown } = this.state;
    const {
      onAddTagToContents,
      contentId,
      canEditPlaylists,
      style,
      tags
    } = this.props;
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
            {tags.map((tag, index) => (
              <a
                style={{ marginRight: '0.5rem' }}
                key={tag.id}
                onClick={() =>
                  this.setState({
                    shownPlaylistId: tag.id,
                    shownPlaylistTitle: tag.title
                  })
                }
              >
                {hashfy(tag.title)}
              </a>
            ))}
            {canEditPlaylists && (
              <a
                style={{
                  color: tags.length > 0 ? Color.orange() : Color.blue()
                }}
                onClick={() => this.setState({ tagModalShown: true })}
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
            onHide={() => this.setState({ tagModalShown: false })}
            onAddPlaylist={({ videoIds, playlistId, playlistTitle }) =>
              onAddTagToContents?.({
                contentIds: videoIds,
                contentType: 'video',
                tagId: playlistId,
                tagTitle: playlistTitle
              })
            }
            onSubmit={this.onTagSubmit}
            videoId={contentId}
          />
        )}
        {shownPlaylistId && (
          <PlaylistModal
            title={shownPlaylistTitle}
            playlistId={shownPlaylistId}
            onHide={() =>
              this.setState({ shownPlaylistId: null, shownPlaylistTitle: '' })
            }
          />
        )}
      </div>
    );
  }

  onTagSubmit = selectedPlaylists => {
    const { onAddTags, contentId } = this.props;
    onAddTags({ tags: selectedPlaylists, type: 'video', contentId });
    this.setState(state => ({
      tagModalShown: false
    }));
  };
}

export default connect(state => ({
  canEditPlaylists: state.UserReducer.canEditPlaylists
}))(TagStatus);
