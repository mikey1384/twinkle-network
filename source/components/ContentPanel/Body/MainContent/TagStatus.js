import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hashfy } from 'helpers/stringHelpers';
import { fetchPlaylistsContaining } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import { css } from 'emotion';

class TagStatus extends Component {
  mounted = false;
  state = {
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
    const { playlists } = this.state;
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
        {playlists.length > 0 ? (
          <div style={{ padding: '0 1rem' }}>
            {playlists.map((playlist, index) => (
              <a
                style={{ marginLeft: index !== 0 ? '0.5rem' : 0 }}
                key={playlist.id}
              >
                {hashfy(playlist.title)}
              </a>
            ))}
          </div>
        ) : canEditPlaylists ? (
          <div
            style={{
              display: 'flex',
              padding: '0 1rem'
            }}
          >
            <a>+ Add to Playlists</a>
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(state => ({
  canEditPlaylists: state.UserReducer.canEditPlaylists
}))(TagStatus);
