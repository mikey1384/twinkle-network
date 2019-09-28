import VIDEO from '../constants/Video';

export default function VideoReducer(state = defaultState, action) {
  let loadMorePlaylistsToPinButton = false;
  switch (action.type) {
    case VIDEO.CHANGE_PINNED_PLAYLISTS:
      return {
        ...state,
        pinnedPlaylists: action.data
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
