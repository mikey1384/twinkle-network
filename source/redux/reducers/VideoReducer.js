import VIDEO from '../constants/Video';

const defaultState = {
  loaded: false,
  allVideoThumbs: [],
  addVideoModalShown: false,
  currentVideoSlot: null,

  addPlaylistModalShown: false,
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
  reorderFeaturedPlaylistsShown: false,
  clickSafe: true
};

export default function VideoReducer(state = defaultState, action) {
  let loadMorePlaylistsToPinButton = false;
  switch (action.type) {
    case VIDEO.CHANGE_PINNED_PLAYLISTS:
      return {
        ...state,
        pinnedPlaylists: action.data
      };
    case VIDEO.DELETE:
      const newVideoThumbs = state.allVideoThumbs;
      newVideoThumbs.splice(action.arrayIndex, 1);
      return {
        ...state,
        allVideoThumbs: newVideoThumbs.concat(action.data)
      };
    case VIDEO.EDIT_PLAYLIST_TITLE:
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          title:
            playlist.id === action.playlistId ? action.title : playlist.title
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          title:
            playlist.id === action.playlistId ? action.title : playlist.title
        })),
        searchedPlaylists: state.searchedPlaylists.map(playlist => ({
          ...playlist,
          title:
            playlist.id === action.playlistId ? action.title : playlist.title
        }))
      };
    case VIDEO.EDIT_TITLE:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(thumb => ({
          ...thumb,
          title: thumb.id === action.videoId ? action.title : thumb.title
        }))
      };
    case VIDEO.EDIT_THUMBS:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(video =>
          video.id === action.params.videoId
            ? {
                ...video,
                title: action.params.title,
                content: action.params.url
              }
            : video
        ),
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.params.videoId
              ? {
                  ...video,
                  video_title: action.params.title,
                  content: action.params.url
                }
              : video
          )
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.params.videoId
              ? {
                  ...video,
                  video_title: action.params.title,
                  content: action.params.url
                }
              : video
          )
        })),
        searchedPlaylists: state.searchedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.params.videoId
              ? {
                  ...video,
                  video_title: action.params.title,
                  content: action.params.url
                }
              : video
          )
        }))
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
        allVideoThumbs: state.allVideoThumbs.map(video => {
          return video.id === action.videoId
            ? {
                ...video,
                likes: action.likes
              }
            : video;
        }),
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.videoId
              ? {
                  ...video,
                  likes: action.likes
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
                  likes: action.likes
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
                  likes: action.likes
                }
              : video
          )
        }))
      };
    case VIDEO.LOAD:
      return {
        ...state,
        loaded: true
      };
    case VIDEO.LOAD_FEATURED_PLAYLISTS:
      return {
        ...state,
        pinnedPlaylists: action.playlists,
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
    case VIDEO.OPEN_MODAL:
      return {
        ...state,
        addVideoModalShown: true
      };
    case VIDEO.OPEN_PLAYLIST_MODAL:
      return {
        ...state,
        addPlaylistModalShown: true
      };
    case VIDEO.OPEN_REORDER_PINNED_PL_MODAL:
      return {
        ...state,
        reorderFeaturedPlaylistsShown: true
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
    case VIDEO.SET_REWARD_LEVEL:
      return {
        ...state,
        allVideoThumbs: state.allVideoThumbs.map(video => {
          return video.id === action.videoId
            ? {
                ...video,
                rewardLevel: action.rewardLevel
              }
            : video;
        }),
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist: playlist.playlist.map(video =>
            video.videoId === action.videoId
              ? {
                  ...video,
                  rewardLevel: action.rewardLevel
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
                  rewardLevel: action.rewardLevel
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
                  rewardLevel: action.rewardLevel
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
