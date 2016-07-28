import React, {Component} from 'react';
import PlaylistCarousel from '../Carousels/PlaylistCarousel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as PlaylistActions from 'redux/actions/PlaylistActions';

const last = array => {
  return array[array.length - 1];
};

@connect(
  null,
  dispatch => ({
    actions: bindActionCreators(PlaylistActions, dispatch)
  })
)
export default class PlaylistsPanel extends Component {
  constructor() {
    super()
    this.loadMorePlaylists = this.loadMorePlaylists.bind(this)
  }

  render() {
    const {loadMoreButton, actions, playlists, buttonGroupShown, buttonGroup} = this.props;
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{this.props.title}</h3>
          {buttonGroupShown &&
            buttonGroup()
          }
        </div>
        <div className="panel-body">
          {this.renderPlaylists()}
          {playlists.length === 0 &&
            <div className="text-center">No Playlists</div>
          }
          {loadMoreButton &&
            <div className="text-center">
              <button className="btn btn-default" onClick={this.loadMorePlaylists}>Load More</button>
            </div>
          }
        </div>
      </div>
    )
  }

  renderPlaylists() {
    const {playlists, playlistType, userId} = this.props;
    return playlists.map((playlist, index) => {
      const editable = userId === playlist.uploaderId;
      return (
        <PlaylistCarousel
          key={index}
          arrayNumber={index}
          {...playlist}
          editable={editable}
          {...this.props.actions}
        />
      )
    })
  }

  loadMorePlaylists() {
    const {playlists, actions} = this.props;
    const lastId = last(playlists).id;
    actions.getMorePlaylistsAsync(lastId);
  }
}
