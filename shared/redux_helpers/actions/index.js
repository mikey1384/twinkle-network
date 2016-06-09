import { initSessionAsync } from './UserActions';
import { getInitialVideos } from './VideoActions';
import { getPinnedPlaylistsAsync, getPlaylistsAsync } from './PlaylistActions';

export function initActions (session) {
  return dispatch => {
    const needs = [
      getPinnedPlaylistsAsync,
      getPlaylistsAsync,
      getInitialVideos
    ];

    const promises = needs.map(need => dispatch(need(session)));

    return Promise.all(promises);
  }
}
