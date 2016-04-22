import React, { Component, PropTypes } from 'react';
import PlaylistCarousel from 'components/PlaylistCarousel';
import LoadMoreButton from 'components/LoadMoreButton';

class PlaylistsPanel extends Component {
  state = {
    addPlaylistModalShown: false
  }

  renderPlaylists() {
    const { playlists, playlistType, userId } = this.props;
    let playlistIndex = 0;
    return playlists.map(playlist => {
      const editable = userId == playlist.uploaderId ? true : false;
      const index = playlistIndex++;
      return (
        <PlaylistCarousel
          key={index}
          arrayNumber={index}
          {...playlist}
          editable={editable}
          editPlaylistTitle={this.props.editPlaylistTitle}
          resetPlaylistState={this.props.resetPlaylistState}
          deletePlaylist={this.props.deletePlaylist}
          openChangePlaylistVideosModal={this.props.openChangePlaylistVideosModal}
          openReorderPlaylistVideosModal={this.props.openReorderPlaylistVideosModal}
        />
      )
    })
  }

  renderButtonGroup() {
    const buttonGroup = this.props.buttonGroup.bind(this);
    return buttonGroup();
  }

  onButtonOneClick() {
    const action = this.props.onButtonOneClick.bind(this);
    action();
  }

  onModalHide() {
    this.setState({addPlaylistModalShown:false})
  }

  render() {
    const { loadMoreButton, getMorePlaylists, playlists, buttonGroupShown } = this.props;
    const loadMorePlaylists = () => {
      const last = (array) => {
        return array[array.length - 1];
      };
      const lastId = last(playlists).id;
      getMorePlaylists(lastId);
    }
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{ this.props.title }</h3>
          {
            buttonGroupShown &&
            this.renderButtonGroup()
          }
        </div>
        <div className="panel-body">
          { this.renderPlaylists() }
          {
            playlists.length === 0 && <div className="text-center">No Playlists</div>
          }
          { loadMoreButton &&
            <div className="text-center">
              <button className="btn btn-default" onClick={loadMorePlaylists}>Load More</button>
            </div>
          }
        </div>
      </div>
    );
  }

}

export default PlaylistsPanel;
