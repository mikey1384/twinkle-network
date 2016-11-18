import React, {Component, PropTypes} from 'react';
import PlaylistCarousel from '../Carousels/PlaylistCarousel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Button from 'components/Button';
import {getMorePlaylistsAsync} from 'redux/actions/PlaylistActions';

const last = array => {
  return array[array.length - 1];
};

@connect(
  null,
  {getMorePlaylistsAsync}
)
export default class PlaylistsPanel extends Component {
  static propTypes = {
    playlists: PropTypes.array.isRequired,
    userId: PropTypes.number,
    title: PropTypes.string,
    buttonGroup: PropTypes.func,
    buttonGroupShown: PropTypes.bool,
    loadMoreButton: PropTypes.bool
  }

  constructor() {
    super()
    this.loadMorePlaylists = this.loadMorePlaylists.bind(this)
  }

  render() {
    const {loadMoreButton, playlists, buttonGroupShown, buttonGroup, title = "All Playlists"} = this.props;
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
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
              <Button className="btn btn-success" onClick={this.loadMorePlaylists}>Load More</Button>
            </div>
          }
        </div>
      </div>
    )
  }

  renderPlaylists() {
    const {playlists, userId} = this.props;
    return playlists.map((playlist, index) => {
      const editable = userId === playlist.uploaderId;
      return (
        <PlaylistCarousel
          key={index}
          arrayIndex={index}
          {...playlist}
          editable={editable}
        />
      )
    })
  }

  loadMorePlaylists() {
    const {playlists, getMorePlaylistsAsync} = this.props;
    const lastId = last(playlists).id;
    getMorePlaylistsAsync(lastId);
  }
}
