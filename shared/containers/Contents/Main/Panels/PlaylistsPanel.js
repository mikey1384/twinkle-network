import React, { Component } from 'react';
import PlaylistCarousel from '../Carousels/PlaylistCarousel';

class PlaylistsPanel extends Component {
  state = {
    addPlaylistModalShown: false
  }

  renderPlaylists() {
    const { playlists, playlistType, userId } = this.props;
    return playlists.map((playlist, index) => {
      const editable = userId == playlist.uploaderId ? true : false;
      return (
        <PlaylistCarousel
          key={index}
          arrayNumber={index}
          {...playlist}
          editable={editable}
          editPlaylistTitle={this.props.editPlaylistTitleAsync}
          resetPlaylistModalState={this.props.resetPlaylistModalState}
          deletePlaylist={this.props.deletePlaylistAsync}
          openChangePlaylistVideosModal={this.props.openChangePlaylistVideosModalAsync}
          openReorderPlaylistVideosModal={this.props.openReorderPlaylistVideosModal}
          dispatch={this.props.dispatch}
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
    const { loadMoreButton, getMorePlaylistsAsync, playlists, buttonGroupShown } = this.props;
    const loadMorePlaylists = () => {
      const last = (array) => {
        return array[array.length - 1];
      };
      const lastId = last(playlists).id;
      getMorePlaylistsAsync(lastId);
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
