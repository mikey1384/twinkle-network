import {getInitialVideos} from './VideoActions';
import {getPinnedPlaylistsAsync, getPlaylistsAsync} from './PlaylistActions';

export function initActions(location) {
  //console.log(location);
  return dispatch => {
    const actions = [
      getPinnedPlaylistsAsync,
      getPlaylistsAsync,
      getInitialVideos
    ];

    const promises = actions.map(action => dispatch(action()));

    return Promise.all(promises);
  }
}
