import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlaylistModal from 'components/Modals/PlaylistModal';
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
    playlists: []
  };

  static propTypes = {
    canEditPlaylists: PropTypes.bool,
    contentId: PropTypes.number.isRequired
  };

  async componentDidMount() {
    const { contentId } = this.props;
    this.mounted = true;
    const playlists = await fetchPlaylistsContaining({ videoId: contentId });
    if (this.mounted) this.setState({ playlists });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { playlists, shownPlaylistId, shownPlaylistTitle } = this.state;
    const { canEditPlaylists } = this.props;
    return (
      <div
        className={css`
          a {
            font-weight: bold;
            cursor: pointer;
          }
        `}
      >
        {(playlists.length > 0 || canEditPlaylists) && (
          <div style={{ padding: '0 1rem' }}>
            {playlists.map((playlist, index) => (
              <a
                style={{ marginLeft: index !== 0 ? '0.5rem' : 0 }}
                key={playlist.id}
                onClick={() =>
                  this.setState({
                    shownPlaylistId: playlist.id,
                    shownPlaylistTitle: playlist.title
                  })
                }
              >
                {hashfy(playlist.title)}
              </a>
            ))}
            {canEditPlaylists && (
              <a
                style={{
                  marginLeft: playlists.length > 0 ? '1rem' : 0,
                  color: playlists.length > 0 ? Color.orange() : Color.blue()
                }}
              >
                +Add
                {playlists.length === 0 ? ' to Playlists' : ''}
              </a>
            )}
          </div>
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
}

export default connect(state => ({
  canEditPlaylists: state.UserReducer.canEditPlaylists
}))(TagStatus);
