import VIDEO from '../constants/Video';

const defaultState = {
  loaded: false,
  allVideoThumbs: [],
  loadMoreVideosButton: false,
  allVideosLoaded: false,
  addVideoModalShown: false,
  currentVideoSlot: null,

  allPlaylists: [],
  searchedPlaylists: [],
  pinnedPlaylists: [],
  allPlaylistsLoaded: false,
  pinnedPlaylistsLoaded: false,
  loadMorePlaylistsButton: false,
  selectPlaylistsToPinModalShown: false,
  loadMorePlaylistsToPinButton: false,
  loadMoreSearchedPlaylistsButton: false,
  playlistsToPin: [],
  reorderPinnedPlaylistsModalShown: false,
  clickSafe: true
};

export default function VideoReducer(state = defaultState, action) {
  let loadMorePlaylistsToPinButton = false;
  switch (action.type) {
    case VIDEO.CHANGE_BY_USER_STATUS:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb =>
          thumb.id === action.videoId
            ? {
                ...thumb,
                byUser: action.byUser
              }
            : thumb
        )
      };
    case VIDEO.CHANGE_PINNED_PLAYLISTS:
      return {
        ...state,
        pinnedPlaylists: action.data
      };
    case VIDEO.CHANGE_PLAYLIST_VIDEOS:
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
    case VIDEO.CLOSE_MODAL:
      return {
        ...state,
        addVideoModalShown: false
      };
    case VIDEO.CLOSE_REORDER_PINNED_PL_MODAL:
      return {
        ...state,
        reorderPinnedPlaylistsModalShown: false
      };
    case VIDEO.CLOSE_SELECT_PL_TO_PIN_MODAL:
      return {
        ...state,
        loadMorePlaylistsToPinButton: false,
        selectPlaylistsToPinModalShown: false
      };
    case VIDEO.DELETE:
      const newVideoThumbs = state.allVideoThumbs;
      newVideoThumbs.splice(action.arrayIndex, 1);
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      };
    case VIDEO.DELETE_PLAYLIST:
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
    case VIDEO.EDIT_PLAYLIST_TITLE:
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
    case VIDEO.EDIT_TITLE:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => ({
          ...thumb,
          title: thumb.id === action.videoId ? action.data : thumb.title
        }))
      };
    case VIDEO.EDIT_THUMBS:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return {
            ...thumb,
            title:
              thumb.id === action.params.videoId
                ? action.params.title
                : thumb.title,
            content:
              thumb.id === action.params.videoId
                ? action.params.url
                : thumb.content
          };
        })
      };
    case VIDEO.EMPTY_CURRENT_VIDEO_SLOT:
      return {
        ...state,
        currentVideoSlot: null
      };
    case VIDEO.FILL_CURRENT_VIDEO_SLOT:
      return {
        ...state,
        currentVideoSlot: action.videoId
      };
    case VIDEO.LIKE:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb =>
          thumb.id === action.videoId
            ? {
                ...thumb,
                numLikes: action.data.length
              }
            : thumb
        )
      };
    case VIDEO.LIKE_PLAYLIST_VIDEO:
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
    case VIDEO.LOAD:
      return {
        ...state,
        loaded: true,
        allVideoThumbs: action.initialRun
          ? action.videos
          : state.allVideoThumbs.concat(action.videos),
        loadMoreVideosButton: action.loadMoreButton,
        allVideosLoaded: !action.loadMoreButton
      };
    case VIDEO.LOAD_PINNED_PLAYLISTS:
      return {
        ...state,
        pinnedPlaylists: action.data.playlists,
        pinnedPlaylistsLoaded: true
      };
    case VIDEO.LOAD_PLAYLISTS:
      return {
        ...state,
        allPlaylistsLoaded: true,
        allPlaylists: action.playlists,
        loadMorePlaylistsButton: action.loadMoreButton
      };
    case VIDEO.LOAD_MORE_PLAYLISTS:
      return {
        ...state,
        ...(action.isSearch
          ? {
              searchedPlaylists: state.searchedPlaylists.concat(
                action.playlists
              ),
              loadMoreSearchedPlaylistsButton: action.loadMoreButton
            }
          : {
              allPlaylists: state.allPlaylists.concat(action.playlists),
              loadMorePlaylistsButton: action.loadMoreButton
            })
      };
    case VIDEO.LOAD_MORE_PL_LIST:
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
    case VIDEO.OPEN_MODAL:
      return {
        ...state,
        addVideoModalShown: true
      };
    case VIDEO.OPEN_REORDER_PINNED_PL_MODAL:
      return {
        ...state,
        reorderPinnedPlaylistsModalShown: true
      };
    case VIDEO.OPEN_SELECT_PL_TO_PIN_MODAL:
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
    case VIDEO.SET_DIFFICULTY:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => {
          return thumb.id === action.videoId
            ? {
                ...thumb,
                difficulty: action.difficulty
              }
            : thumb;
        })
      };
    case VIDEO.SET_PLAYLIST_VIDEOS_DIFFICULTY:
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.videoId
              ? {
                  ...video,
                  difficulty: action.difficulty
                }
              : video
          )
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.videoId
              ? {
                  ...video,
                  difficulty: action.difficulty
                }
              : video
          )
        })),
        searchedPlaylists: state.searchedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.videoId
              ? {
                  ...video,
                  difficulty: action.difficulty
                }
              : video
          )
        }))
      };
    case VIDEO.SET_SEARCHED_PLAYLISTS:
      return {
        ...state,
        searchedPlaylists: action.playlists,
        loadMoreSearchedPlaylistsButton: action.loadMoreButton
      };
    case VIDEO.TURN_OFF_CLICK_SAFE:
      return {
        ...state,
        clickSafe: false
      };
    case VIDEO.TURN_ON_CLICK_SAFE:
      return {
        ...state,
        clickSafe: true
      };
    case VIDEO.UPLOAD:
      const newState = [action.data].concat(state.allVideoThumbs);
      if (!state.allVideosLoaded) {
        newState.pop();
      }
      return {
        ...state,
        allVideoThumbs: newState,
        addVideoModalShown: false
      };
    case VIDEO.UPLOAD_PLAYLIST:
      return {
        ...state,
        allPlaylists: [action.data].concat(state.allPlaylists),
        loadMoreButton: state.loadMoreButton,
        addPlaylistModalShown: false
      };
    default:
      return state;
  }
}
