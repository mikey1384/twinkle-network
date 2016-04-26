const defaultState = {
  allPlaylists: [],
  pinnedPlaylists: [],
  loadMoreButton: false,

  videoThumbsForModal: [],
  loadMoreButtonForModal: false,
  allVideosLoadedForModal: false,

  addPlaylistModalShown: false,
  editPlaylistModalType: null,
  selectedModalThumbs: [],

  selectPlaylistsToPinModalShown: false,
  loadMorePlaylistsToPinButton: false,
  playlistsToPin: [],

  reorderPinnedPlaylistsModalShown: false
};

let defaultPlaylists,
    defaultPinnedPlaylists

export default function PlaylistReducer(state = defaultState, action) {
  let loadMoreButtonForModal = false;
  let allVideosLoadedForModal = false;
  let loadMorePlaylistsToPinButton = false;
  switch(action.type) {
    case 'GET_PLAYLISTS':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      let loadMoreButton = false;
      if (action.data.playlists.length > 3) {
        action.data.playlists.pop();
        loadMoreButton = true;
      }
      if (action.initialRun) {
        defaultPlaylists = action.data.playlists;
        return {
          ...state,
          allPlaylists: defaultPlaylists,
          loadMoreButton
        }
      } else {
        return {
          ...state,
          allPlaylists: state.allPlaylists.concat(action.data.playlists),
          loadMoreButton
        };
      }
    case 'GET_PINNED_PLAYLISTS':
      defaultPinnedPlaylists = action.data.playlists;
      return {
        ...state,
        pinnedPlaylists: defaultPinnedPlaylists
      }
    case 'GET_VIDEOS_FOR_MODAL':
      if (action.data.length > 18) {
        action.data.pop();
        loadMoreButtonForModal = true;
      } else {
        allVideosLoadedForModal = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          videoThumbsForModal: action.data,
          loadMoreButtonForModal,
          allVideosLoadedForModal
        }
      } else {
        return {
          ...state,
          videoThumbsForModal: state.videoThumbsForModal.concat(action.data),
          loadMoreButtonForModal,
          allVideosLoadedForModal
        }
      }
    case 'ADD_PL_MODAL_OPEN':
      return {
        ...state,
        addPlaylistModalShown: true
      };
    case 'ADD_PL_MODAL_CLOSE':
      return {
        ...state,
        addPlaylistModalShown: false
      }
    case 'SELECT_PL_TO_PIN_OPEN':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      if (action.data.result.length > 10) {
        action.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      let playlistsToPin = action.data.result.map(item => {
        return {
          title: item.title,
          id: item.id
        }
      })
      return {
        ...state,
        playlistsToPin,
        loadMorePlaylistsToPinButton,
        selectPlaylistsToPinModalShown: true
      }
    case 'SELECT_PL_TO_PIN_CLOSE':
      return {
        ...state,
        loadMorePlaylistsToPinButton: false,
        selectPlaylistsToPinModalShown: false
      }
    case 'LOAD_MORE_PLAYLIST_LIST':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      if (action.data.result.length > 10) {
        action.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      let morePlaylistsToPin = action.data.result.map(item => {
        return {
          title: item.title,
          id: item.id
        }
      })
      return {
        ...state,
        playlistsToPin: state.playlistsToPin.concat(morePlaylistsToPin),
        loadMorePlaylistsToPinButton
      }
    case 'CHANGE_PINNED_PLAYLISTS':
      if (action.data.error) {
        console.error(action.data.error);
        return state;
      }
      if (action.data.playlists) {
        defaultPinnedPlaylists = action.data.playlists;
        return {
          ...state,
          pinnedPlaylists: defaultPinnedPlaylists
        }
      }
      return state;
    case 'REORDER_PINNED_PL_OPEN':
      return {
        ...state,
        reorderPinnedPlaylistsModalShown: true
      }
    case 'REORDER_PINNED_PL_CLOSE':
      return {
        ...state,
        reorderPinnedPlaylistsModalShown: false
      }
    case 'CHANGE_PL_VIDS_MODAL_OPEN':
      if (action.data.length > 18) {
        action.data.pop();
        loadMoreButtonForModal = true;
      } else {
        allVideosLoadedForModal = true;
      }
      return {
        ...state,
        editPlaylistModalType: action.modalType,
        videoThumbsForModal: action.data,
        loadMoreButtonForModal,
        allVideosLoadedForModal
      }
    case 'REORDER_PL_VIDS_MODAL_OPEN':
      const videoThumbs = action.playlistVideos.map(video => {
        return {
          id: video.videoid,
          title: video.video_title,
          uploadername: video.video_uploader,
          videocode: video.videocode
        }
      })
      return {
        ...state,
        editPlaylistModalType: action.modalType,
        videoThumbsForModal: videoThumbs
      }
    case 'UPLOAD_PLAYLIST':
      let loadMoreButtonDisplayed = false;
      if (defaultPlaylists.length > 2) {
        defaultPlaylists.pop();
        defaultPlaylists = [action.data.result].concat(defaultPlaylists);
        if (!state.loadMoreButton) loadMoreButtonDisplayed = true;
      } else {
        defaultPlaylists = [action.data.result].concat(state.allPlaylists);
      }
      return {
        ...state,
        allPlaylists: [action.data.result].concat(state.allPlaylists),
        loadMoreButton: loadMoreButtonDisplayed,
        addPlaylistModalShown: false
      }
    case 'EDIT_PLAYLIST_TITLE':
    if (action.data.result) {
      defaultPlaylists = state.allPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.title = action.data.result
        }
        return playlist;
      })
      defaultPinnedPlaylists = state.pinnedPlaylists.map(playlist => {
        if (playlist.id === action.playlistId) {
          playlist.title = action.data.result
        }
        return playlist;
      })
      return {
        ...state,
        pinnedPlaylists: defaultPinnedPlaylists,
        allPlaylists: defaultPlaylists
      }
    } else {
      console.error(action.data.error);
      return state;
    }
    case 'CHANGE_PLAYLIST_VIDEOS':
      if (action.data.error) {
        let { error } = action.data;
        console.error(error);
        return state;
      }
      if (action.data.result) {
        let { result } = action.data;
        defaultPlaylists = state.allPlaylists.map(playlist => {
          if (playlist.id === action.playlistId) {
            playlist.playlist = result;
          }
          return playlist;
        })
        defaultPinnedPlaylists = state.pinnedPlaylists.map(playlist => {
          if (playlist.id === action.playlistId) {
            playlist.playlist = result;
          }
          return playlist;
        })
        return {
          ...state,
          pinnedPlaylists: defaultPinnedPlaylists,
          allPlaylists: defaultPlaylists
        }
      }
    case 'DELETE_PLAYLIST':
      if (action.data.success) {
        defaultPlaylists = state.allPlaylists.filter(playlist => {
          if (playlist.id === action.playlistId) {
            return false;
          }
          return true;
        })
        defaultPinnedPlaylists = state.pinnedPlaylists.filter(playlist => {
          if (playlist.id === action.playlistId) {
            return false;
          }
          return true;
        })
        return {
          ...state,
          pinnedPlaylists: defaultPinnedPlaylists,
          allPlaylists: defaultPlaylists
        }
      }
      return state;
    case 'RESET_PL_STATE':
      return {
        allPlaylists: defaultPlaylists,
        pinnedPlaylists: defaultPinnedPlaylists,
        loadMoreButton: false,

        videoThumbsForModal: [],
        loadMoreButtonForModal: false,
        allVideosLoadedForModal: false,

        addPlaylistModalShown: false,
        editPlaylistModalType: null,
        selectedModalThumbs: [],

        selectPlaylistsToPinModalShown: false,
        loadMorePlaylistsToPinButton: false,
        playlistsToPin: [],

        reorderPinnedPlaylistsModalShown: false
      }
    case 'RESET_PL_MODAL_STATE':
      return {
        videoThumbsForModal: [],
        loadMoreButtonForModal: false,
        allVideosLoadedForModal: false,

        addPlaylistModalShown: false,
        editPlaylistModalType: null,
        selectedModalThumbs: [],

        selectPlaylistsToPinModalShown: false,
        loadMorePlaylistsToPinButton: false,
        playlistsToPin: []
      }
    default:
      return state;
  }
}
