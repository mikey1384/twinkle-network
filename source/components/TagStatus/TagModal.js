import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import TagForm from 'components/Forms/TagForm';
import AddPlaylistModal from 'components/Modals/AddPlaylistModal';
import { addVideoToPlaylists, searchContent } from 'helpers/requestHelpers';
import { hashfy } from 'helpers/stringHelpers';
import { connect } from 'react-redux';

class TagModal extends Component {
  static propTypes = {
    currentPlaylists: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    videoId: PropTypes.number.isRequired,
    onAddPlaylist: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    addPlaylistModalShown: false,
    notFoundMessageShown: false,
    searchText: '',
    searchResults: [],
    selectedPlaylists: []
  };

  render() {
    const { currentPlaylists, title, onHide, videoId } = this.props;
    const {
      addPlaylistModalShown,
      notFoundMessageShown,
      searchResults,
      searchText,
      selectedPlaylists
    } = this.state;
    return (
      <Modal onHide={onHide}>
        <header>{title}</header>
        <main>
          <TagForm
            title="Search Playlists"
            itemLabel="title"
            searchResults={searchResults}
            filter={result => currentPlaylists.indexOf(result.id) === -1}
            onSearch={this.onSearchPlaylists}
            onClear={this.onClearSearchResults}
            onAddItem={playlist =>
              this.setState(state => ({
                addPlaylistModalShown: false,
                selectedPlaylists: state.selectedPlaylists.concat([playlist])
              }))
            }
            onNotFound={({ messageShown }) =>
              this.setState({ notFoundMessageShown: messageShown })
            }
            onRemoveItem={this.onRemovePlaylist}
            onSubmit={selectedPlaylists.length > 0 && this.onSubmit}
            renderDropdownLabel={item => <span>{item.title}</span>}
            renderTagLabel={label => hashfy(label)}
            searchPlaceholder="Search for playlists here..."
            selectedItems={selectedPlaylists}
          >
            {notFoundMessageShown && (
              <div style={{ marginTop: '0.5rem' }}>
                No playlists were found.{' '}
                <a
                  onClick={() => this.setState({ addPlaylistModalShown: true })}
                >
                  Create a new playlist
                </a>
              </div>
            )}
          </TagForm>
          {addPlaylistModalShown && (
            <AddPlaylistModal
              excludeVideoIds={[videoId]}
              postPlaylist={this.onAddPlaylist}
              onHide={() => this.setState({ addPlaylistModalShown: false })}
              title={searchText}
            />
          )}
        </main>
        <footer>
          <Button
            disabled={selectedPlaylists.length === 0}
            primary
            onClick={this.onSubmit}
          >
            Done
          </Button>
          <Button transparent style={{ marginRight: '1rem' }} onClick={onHide}>
            Cancel
          </Button>
        </footer>
      </Modal>
    );
  }

  onAddPlaylist = playlist => {
    const { onAddPlaylist, videoId } = this.props;
    onAddPlaylist({
      videoIds: playlist?.playlist
        ?.map(video => video.videoId)
        ?.filter(id => id !== videoId),
      playlistId: playlist.id,
      playlistTitle: playlist.title
    });
    this.setState(state => ({
      addPlaylistModalShown: false,
      selectedPlaylists: state.selectedPlaylists.concat([playlist])
    }));
  };

  onClearSearchResults = () => {
    this.setState({ searchResults: [] });
  };

  onRemovePlaylist = playlistId => {
    this.setState(state => ({
      selectedPlaylists: state.selectedPlaylists.filter(
        playlist => playlist.id !== playlistId
      )
    }));
  };

  onSubmit = async() => {
    const { dispatch, onSubmit, videoId } = this.props;
    const { selectedPlaylists } = this.state;
    await addVideoToPlaylists({
      dispatch,
      videoId,
      playlistIds: selectedPlaylists.map(playlist => playlist.id)
    });
    this.setState({ searchText: '' });
    onSubmit(selectedPlaylists);
  };

  onSearchPlaylists = async text => {
    const { results } = await searchContent({
      filter: 'playlist',
      searchText: text,
      limit: 5
    });
    this.setState({ searchText: text, searchResults: results });
  };
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(TagModal);
