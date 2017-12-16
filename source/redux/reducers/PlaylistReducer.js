const defaultState = {
  allPlaylists: [],
  pinnedPlaylists: [],
  allPlaylistsLoaded: false,
  pinnedPlaylistsLoaded: false,
  loadMoreButton: false,

  selectPlaylistsToPinModalShown: false,
  loadMorePlaylistsToPinButton: false,
  playlistsToPin: [],

  reorderPinnedPlaylistsModalShown: false,

  clickSafe: true
}

export default function PlaylistReducer(state = defaultState, action) {
  let loadMorePlaylistsToPinButton = false
  let loadMoreButton = false
  switch (action.type) {
    case 'GET_PLAYLISTS':
      if (action.data.playlists.length > 3) {
        action.data.playlists.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        allPlaylistsLoaded: true,
        allPlaylists: action.data.playlists,
        loadMoreButton
      }
    case 'GET_MORE_PLAYLISTS':
      if (action.data.playlists.length > 3) {
        action.data.playlists.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        allPlaylists: state.allPlaylists.concat(action.data.playlists),
        loadMoreButton
      }
    case 'GET_PINNED_PLAYLISTS':
      return {
        ...state,
        pinnedPlaylists: action.data.playlists,
        pinnedPlaylistsLoaded: true
      }
    case 'SELECT_PL_TO_PIN_OPEN':
      if (action.data.result.length > 10) {
        action.data.result.pop()
        loadMorePlaylistsToPinButton = true
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
      if (action.data.result.length > 10) {
        action.data.result.pop()
        loadMorePlaylistsToPinButton = true
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
      return {
        ...state,
        pinnedPlaylists: action.data
      }
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
    case 'UPLOAD_PLAYLIST':
      let loadMoreButtonDisplayed = state.loadMoreButton
      return {
        ...state,
        allPlaylists: [action.data].concat(state.allPlaylists),
        loadMoreButton: loadMoreButtonDisplayed,
        addPlaylistModalShown: false
      }
    case 'EDIT_PLAYLIST_TITLE':
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
        }))
      }
    case 'CHANGE_PLAYLIST_VIDEOS':
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.map(playlist => ({
          ...playlist,
          playlist:
            playlist.id === action.playlistId ? action.data : playlist.playlist
        })),
        allPlaylists: state.allPlaylists.map(playlist => ({
          ...playlist,
          playlist:
            playlist.id === action.playlistId ? action.data : playlist.playlist
        }))
      }
    case 'DELETE_PLAYLIST':
      return {
        ...state,
        pinnedPlaylists: state.pinnedPlaylists.filter(
          playlist => playlist.id !== action.data
        ),
        allPlaylists: state.allPlaylists.filter(
          playlist => playlist.id !== action.data
        )
      }
    case 'PLAYLIST_VIDEO_LIKE':
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
      }
    case 'RESET_PL_STATE':
      return {
        ...defaultState,
        allPlaylists: [],
        pinnedPlaylists: []
      }
    case 'CLICK_SAFE_ON':
      return {
        ...state,
        clickSafe: true
      }
    case 'CLICK_SAFE_OFF':
      return {
        ...state,
        clickSafe: false
      }
    default:
      return state
  }
}
