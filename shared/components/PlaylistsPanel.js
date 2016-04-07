import React, { Component, PropTypes } from 'react';
import PlaylistCarousel from 'components/PlaylistCarousel';
import LoadMoreButton from 'components/LoadMoreButton';

class PlaylistsPanel extends Component {
  state = {
    addPlaylistModalShown: false
  }

  renderPlaylists() {
    const { playlists, playlistType, userId } = this.props;
    return playlists.map(playlist => {
      const editable = userId == playlist.uploaderId ? true : false;
      return (
        <PlaylistCarousel
          key={playlists.indexOf(playlist)}
          playlist={playlist.playlist}
          playlistId={playlist.id}
          arrayNumber={playlists.indexOf(playlist)}
          title={playlist.title}
          editable={editable}
          uploader={playlist.uploader}
          editPlaylistTitle={this.props.editPlaylistTitle}
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
      <div className="panel panel-primary" key={this.props.key}>
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{ this.props.title }</h3>
          {
            buttonGroupShown &&
            this.renderButtonGroup()
          }
        </div>
        <div className="panel-body">
          { this.renderPlaylists() }
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
