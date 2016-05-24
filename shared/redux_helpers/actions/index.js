import { getInitialVideos } from './VideoActions';
import { getPinnedPlaylistsAsync, getPlaylistsAsync } from './PlaylistActions';

export function initActions (components, params) {
  return dispatch => {
    const needs = [
      getPinnedPlaylistsAsync,
      getPlaylistsAsync,
      getInitialVideos
    ];

    const promises = needs.map(need => dispatch(need(params)));

    return Promise.all(promises);
  }
}
