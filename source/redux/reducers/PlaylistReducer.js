import PLAYLIST from '../constants/Playlist';

const defaultState = {
  allPlaylists: [],
  searchedPlaylists: [],
  pinnedPlaylists: [],
  allPlaylistsLoaded: false,
  pinnedPlaylistsLoaded: false,
  loadMoreButton: false,
  searchLoadMoreButton: false,

  selectPlaylistsToPinModalShown: false,
  loadMorePlaylistsToPinButton: false,
  playlistsToPin: [],

  reorderPinnedPlaylistsModalShown: false,

  clickSafe: true
};

export default function PlaylistReducer(state = defaultState, action) {
  let loadMorePlaylistsToPinButton = false;
  switch (action.type) {
    case PLAYLIST.LOAD:
      return {
        ...state,
        allPlaylistsLoaded: true,
        allPlaylists: action.playlists,
        loadMoreButton: action.loadMoreButton
      };
    case PLAYLIST.LOAD_MORE:
      return {
        ...state,
        ...(action.isSearch
          ? {
              searchedPlaylists: state.searchedPlaylists.concat(
                action.playlists
              ),
              searchLoadMoreButton: action.loadMoreButton
            }
          : {
              allPlaylists: state.allPlaylists.concat(action.playlists),
              loadMoreButton: action.loadMoreButton
            })
      };
    case PLAYLIST.LOAD_PINNED:
      return {
        ...state,
        pinnedPlaylists: action.data.playlists,
        pinnedPlaylistsLoaded: true
      };
    case PLAYLIST.OPEN_SELECT_PL_TO_PIN_MODAL:
      if (action.data.result.length > 10) {
        action.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      return {
        ...state,
        playlistsToPin: action.data.result.map(item => ({
          title: item.title,
          id: item.id
        })),
        loadMorePlaylistsToPinButton,
        selectPlaylistsToPinModalShown: true
      };
    case PLAYLIST.CLOSE_SELECT_PL_TO_PIN_MODAL:
      return {
        ...state,
        loadMorePlaylistsToPinButton: false,
        selectPlaylistsToPinModalShown: false
      };
    case PLAYLIST.LOAD_MORE_PL_LIST:
      if (action.data.result.length > 10) {
        action.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      return {
        ...state,
        playlistsToPin: state.playlistsToPin.concat(
          action.data.result.map(item => {
            return {
              title: item.title,
              id: item.id
            };
          })
        ),
        loadMorePlaylistsToPinButton
      };
    case PLAYLIST.CHANGE_PINNED:
      return {
        ...state,
        pinnedPlaylists: action.data
      };
    case PLAYLIST.OPEN_REORDER_PINNED_PL_MODAL:
      return {
        ...state,
        reorderPinnedPlaylistsModalShown: true
      };
    case PLAYLIST.CLOSE_REORDER_PINNED_PL_MODAL:
      return {
        ...state,
        reorderPinnedPlaylistsModalShown: false
      };
    case PLAYLIST.UPLOAD:
      return {
        ...state,
        allPlaylists: [action.data].concat(state.allPlaylists),
        loadMoreButton: state.loadMoreButton,
        addPlaylistModalShown: false
      };
    case PLAYLIST.EDIT_TITLE:
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          title:
            playlist.id === action.playlistId ? action.data : playlist.title
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          title:
            playlist.id === action.playlistId ? action.data : playlist.title
        })),
        searchedPlaylists: state.searchedPlaylists.map(playlist => ({
          ...playlist,
          title:
            playlist.id === action.playlistId ? action.data : playlist.title
        }))
      };
    case PLAYLIST.CHANGE_VIDEOS:
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist:
            playlist.id === action.playlistId
              ? action.playlist
              : playlist.playlist
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          playlist:
            playlist.id === action.playlistId
              ? action.playlist
              : playlist.playlist
        })),
        searchedPlaylists: state.searchedPlaylists.map(playlist => ({
          ...playlist,
          playlist:
            playlist.id === action.playlistId
              ? action.playlist
              : playlist.playlist
        }))
      };
    case PLAYLIST.DELETE:
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.filter(
          playlist => playlist.id !== action.data
        ),
        allPlaylists: state.allPlaylists.filter(
          playlist => playlist.id !== action.data
        ),
        searchedPlaylists: state.searchedPlaylists.filter(
          playlist => playlist.id !== action.data
        )
      };
    case PLAYLIST.LIKE_VIDEO:
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video => ({
            ...video,
            numLikes:
              video.videoId === action.videoId
                ? action.data.length
                : video.numLikes
          }))
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video => ({
            ...video,
            numLikes:
              video.videoId === action.videoId
                ? action.data.length
                : video.numLikes
          }))
        }))
      };
    case PLAYLIST.RESET:
      return {
        ...defaultState
      };
    case PLAYLIST.SET_SEARCHED_PLAYLISTS:
      return {
        ...state,
        searchedPlaylists: action.playlists,
        searchLoadMoreButton: action.loadMoreButton
      };
    case PLAYLIST.TURN_ON_CLICK_SAFE:
      return {
        ...state,
        clickSafe: true
      };
    case PLAYLIST.TURN_OFF_CLICK_SAFE:
      return {
        ...state,
        clickSafe: false
      };
    default:
      return state;
  }
}
