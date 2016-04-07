const defaultState = {
  allPlaylists: [],
  pinnedPlaylists: [],
  loadMoreButton: false,
  loadMorePinned: false,
  addPlaylistModalShown: false
};

let initialPlaylists,
    initialPinnedPlaylists

export default function PlaylistReducer(state = defaultState, action) {
  switch(action.type) {
    case 'GET_PLAYLISTS':
      let loadMoreButton = false;
      if (action.res.data.playlists.length > 3) {
        action.res.data.playlists.pop();
        loadMoreButton = true;
      }
      if (action.initialRun) {
        initialPlaylists = action.res.data.playlists;
        return {
          ...state,
          allPlaylists: initialPlaylists,
          loadMoreButton
        }
      } else {
        return {
          ...state,
          allPlaylists: state.allPlaylists.concat(action.res.data.playlists),
          loadMoreButton
        };
      }
    case 'GET_PINNED_PLAYLISTS':
      let loadMorePinned = false;
      if (action.res.data.playlists.length > 3) {
        action.res.data.playlists.pop();
        loadMorePinned = true;
      }
      if (action.initialRun) {
        initialPinnedPlaylists = action.res.data.playlists;
        return {
          ...state,
          pinnedPlaylists: initialPinnedPlaylists,
          loadMorePinned
        }
      } else {
        return {
          ...state,
          pinnedPlaylists: state.pinnedPlaylists.concat(action.res.data.playlists),
          loadMorePinned
        };
      }
    case 'PL_MODAL_OPEN':
      return {
        ...state,
        addPlaylistModalShown: true
      };
    case 'PL_MODAL_CLOSE':
      return {
        ...state,
        addPlaylistModalShown: false
      }
    case 'UPLOAD_PLAYLIST':
      const result = action.res.data.result;
      if (initialPlaylists.length > 2) {
        initialPlaylists.pop();
        initialPlaylists = [result].concat(initialPlaylists);
      }
      return {
        ...state,
        allPlaylists: [result].concat(state.allPlaylists),
        addPlaylistModalShown: false
      }
    case 'EDIT_PLAYLIST_TITLE':
    if (action.res.data.result) {
      const newPlaylists = state.allPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.title = action.res.data.result
        }
        return playlist;
      })
      const newPinnedPlaylists = state.pinnedPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.title = action.res.data.result
        }
        return playlist;
      })
      return {
        ...state,
        pinnedPlaylists: newPinnedPlaylists,
        allPlaylists: newPlaylists
      }
    } else {
      console.log(action.res.data.error);
      return state;
    }
    case 'DELETE_PLAYLIST':
      return state.delete(action.id);
    case 'RESET_PL_STATE':
      return {
        allPlaylists: initialPlaylists,
        pinnedPlaylists: initialPinnedPlaylists,
        loadMoreButton: false,
        loadMorePinned: false,
        addPlaylistModalShown: false
      }
    default:
      return state;
  }
}
