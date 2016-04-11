const defaultState = {
  allPlaylists: [],
  pinnedPlaylists: [],
  loadMoreButton: false,
  loadMorePinned: false,

  videoThumbsForModal: [],
  loadMoreButtonForModal: false,
  allVideosLoadedForModal: false,

  addPlaylistModalShown: false,
  editPlaylistModalType: null,
  selectedModalThumbs: []
};

let initialPlaylists,
    initialPinnedPlaylists

export default function PlaylistReducer(state = defaultState, action) {
  let loadMoreButtonForModal = false;
  let allVideosLoadedForModal = false;
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
    case 'GET_VIDEOS_FOR_MODAL':
      if (action.res.data.length > 18) {
        action.res.data.pop();
        loadMoreButtonForModal = true;
      } else {
        allVideosLoadedForModal = true;
      }
      if (action.initialRun) {
        return {
          ...state,
          videoThumbsForModal: action.res.data,
          loadMoreButtonForModal,
          allVideosLoadedForModal
        }
      } else {
        return {
          ...state,
          videoThumbsForModal: state.videoThumbsForModal.concat(action.res.data),
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
    case 'CHANGE_PL_VIDS_MODAL_OPEN':
      if (action.res.data.length > 18) {
        action.res.data.pop();
        loadMoreButtonForModal = true;
      } else {
        allVideosLoadedForModal = true;
      }
      return {
        ...state,
        editPlaylistModalType: action.modalType,
        videoThumbsForModal: action.res.data,
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
      if (initialPlaylists.length > 2) {
        initialPlaylists.pop();
        initialPlaylists = [action.res.data.result].concat(initialPlaylists);
      }
      return {
        ...state,
        allPlaylists: [action.res.data.result].concat(state.allPlaylists),
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
      console.error(action.res.data.error);
      return state;
    }
    case 'CHANGE_PLAYLIST_VIDEOS':
      if (action.res.data.error) {
        let { error } = action.res.data;
        console.error(error);
        return state;
      }
      if (action.res.data.result) {
        let { result } = action.res.data;
        const newPlaylists = state.allPlaylists.map(playlist => {
          if (playlist.id === action.playlistId) {
            playlist.playlist = result;
          }
          return playlist;
        })
        const newPinnedPlaylists = state.pinnedPlaylists.map(playlist => {
          if (playlist.id === action.playlistId) {
            playlist.playlist = result;
          }
          return playlist;
        })
        initialPlaylists = newPlaylists;
        initialPinnedPlaylists = newPinnedPlaylists;
        return {
          ...state,
          pinnedPlaylists: newPinnedPlaylists,
          allPlaylists: newPlaylists
        }
      }
    case 'DELETE_PLAYLIST':
      if (action.res.data.success) {
        const newPlaylists = state.allPlaylists.filter(playlist => {
          if (playlist.id === action.playlistId) {
            return false;
          }
          return true;
        })
        const newPinnedPlaylists = state.pinnedPlaylists.filter(playlist => {
          if (playlist.id === action.playlistId) {
            return false;
          }
          return true;
        })
        initialPlaylists = newPlaylists;
        initialPinnedPlaylists = newPinnedPlaylists;
        return {
          ...state,
          pinnedPlaylists: newPinnedPlaylists,
          allPlaylists: newPlaylists
        }
      }
      return state;
    case 'RESET_PL_STATE':
      return {
        allPlaylists: initialPlaylists,
        pinnedPlaylists: initialPinnedPlaylists,
        loadMoreButton: false,
        loadMorePinned: false,

        videoThumbsForModal: [],
        loadMoreButtonForModal: false,
        allVideosLoadedForModal: false,

        addPlaylistModalShown: false,
        editPlaylistModalType: null,
        selectedModalThumbs: []
      }
    case 'RESET_PL_MODAL_STATE':
      return {
        videoThumbsForModal: [],
        loadMoreButtonForModal: false,
        allVideosLoadedForModal: false,

        addPlaylistModalShown: false,
        editPlaylistModalType: null,
        selectedModalThumbs: []
      }
    default:
      return state;
  }
}
