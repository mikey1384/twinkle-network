export default function ExploreReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_PLAYLIST_VIDEOS':
      return {
        ...state,
        videos: {
          ...state.videos,
          pinnedPlaylists: state.videos.pinnedPlaylists.map(playlist =>
            playlist.id === action.playlist.id
              ? { ...playlist, ...action.playlist }
              : playlist
          ),
          allPlaylists: state.videos.allPlaylists.map(playlist =>
            playlist.id === action.playlist.id
              ? { ...playlist, ...action.playlist }
              : playlist
          ),
          searchedPlaylists: state.videos.searchedPlaylists.map(playlist =>
            playlist.id === action.playlist.id
              ? { ...playlist, ...action.playlist }
              : playlist
          )
        }
      };
    case 'CHANGE_SEARCH_INPUT':
      return {
        ...state,
        search: {
          ...state.search,
          searchText: action.text
        }
      };
    case 'CHANGE_VIDEO_BY_USER_STATUS':
      return {
        ...state,
        videos: {
          ...state.videos,
          pinnedPlaylists: state.videos.pinnedPlaylists.map(playlist => ({
            ...playlist,
            playlist: playlist.playlist.map(video =>
              video.videoId === action.videoId
                ? {
                    ...video,
                    byUser: action.byUser
                  }
                : video
            )
          })),
          allPlaylists: state.videos.allPlaylists.map(playlist => ({
            ...playlist,
            playlist: playlist.playlist.map(video =>
              video.videoId === action.videoId
                ? {
                    ...video,
                    byUser: action.byUser
                  }
                : video
            )
          })),
          searchedPlaylists: state.videos.searchedPlaylists.map(playlist => ({
            ...playlist,
            playlist: playlist.playlist.map(video =>
              video.videoId === action.videoId
                ? {
                    ...video,
                    byUser: action.byUser
                  }
                : video
            )
          }))
        }
      };
    case 'CLEAR_LINKS_LOADED':
      return {
        ...state,
        links: {
          ...state.links,
          loaded: false
        }
      };
    case 'CLEAR_VIDEOS_LOADED':
      return {
        ...state,
        videos: {
          ...state.videos,
          loaded: false
        }
      };
    case 'CLOSE_PLAYLIST_MODAL':
      return {
        ...state,
        videos: {
          ...state.videos,
          addPlaylistModalShown: false
        }
      };
    case 'CLOSE_REORDER_PINNED_PL_MODAL':
      return {
        ...state,
        videos: {
          ...state.videos,
          reorderFeaturedPlaylistsShown: false
        }
      };
    case 'CLOSE_SELECT_PL_TO_PIN_MODAL':
      return {
        ...state,
        videos: {
          ...state.videos,
          loadMorePlaylistsToPinButton: false,
          selectPlaylistsToPinModalShown: false
        }
      };
    case 'DELETE_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.filter(link => link.id !== action.linkId)
        }
      };
    case 'DELETE_PLAYLIST':
      return {
        ...state,
        videos: {
          ...state.videos,
          pinnedPlaylists: state.videos.pinnedPlaylists.filter(
            playlist => playlist.id !== action.data
          ),
          allPlaylists: state.videos.allPlaylists.filter(
            playlist => playlist.id !== action.data
          ),
          searchedPlaylists: state.videos.searchedPlaylists.filter(
            playlist => playlist.id !== action.data
          )
        }
      };
    case 'EDIT_LINK_PAGE':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
            action.id === link.id
              ? {
                  ...link,
                  title: action.title,
                  content: action.content
                }
              : link
          )
        }
      };
    case 'EDIT_LINK_TITLE':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link => ({
            ...link,
            title: action.data.id === link.id ? action.data.title : link.title
          }))
        }
      };
    case 'EDIT_PLAYLIST_TITLE':
      return {
        ...state,
        videos: {
          ...state.videos,
          pinnedPlaylists: state.videos.pinnedPlaylists.map(playlist => ({
            ...playlist,
            title:
              playlist.id === action.playlistId ? action.title : playlist.title
          })),
          allPlaylists: state.videos.allPlaylists.map(playlist => ({
            ...playlist,
            title:
              playlist.id === action.playlistId ? action.title : playlist.title
          })),
          searchedPlaylists: state.videos.searchedPlaylists.map(playlist => ({
            ...playlist,
            title:
              playlist.id === action.playlistId ? action.title : playlist.title
          }))
        }
      };
    case 'EDIT_VIDEO_THUMBS':
      return {
        ...state,
        videos: {
          ...state.videos,
          pinnedPlaylists: state.videos.pinnedPlaylists.map(playlist => ({
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
          allPlaylists: state.videos.allPlaylists.map(playlist => ({
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
          searchedPlaylists: state.videos.searchedPlaylists.map(playlist => ({
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
        }
      };
    case 'EMPTY_CURRENT_VIDEO_SLOT':
      return {
        videos: {
          ...state.videos,
          currentVideoSlot: null
        }
      };
    case 'FILL_CURRENT_VIDEO_SLOT':
      return {
        videos: {
          ...state.videos,
          currentVideoSlot: action.videoId
        }
      };
    case 'LIKE_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
            action.id === link.id
              ? {
                  ...link,
                  likes: action.likes
                }
              : link
          )
        }
      };
    case 'LOAD_LINKS':
      return {
        ...state,
        links: {
          ...state.links,
          loaded: true,
          links: action.links,
          loadMoreLinksButtonShown: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_LINKS':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.concat(action.links),
          loadMoreLinksButtonShown: action.loadMoreButton
        }
      };
    case 'LOAD_FEATURED_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          featured: action.subjects,
          loaded: true
        }
      };
    case 'LOAD_FEATURED_PLAYLISTS':
      return {
        ...state,
        videos: {
          ...state.videos,
          pinnedPlaylists: action.playlists,
          pinnedPlaylistsLoaded: true
        }
      };
    case 'LOAD_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: action.results,
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: state.search.results.concat(action.results),
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'RELOAD_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          loaded: false
        }
      };
    case 'TURN_OFF_CLICK_SAFE':
      return {
        ...state,
        videos: {
          ...state.videos,
          clickSafe: false
        }
      };
    case 'TURN_ON_CLICK_SAFE':
      return {
        ...state,
        videos: {
          ...state.videos,
          clickSafe: true
        }
      };
    case 'UPDATE_NUM_LINK_COMMENTS':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
            action.id === link.id
              ? {
                  ...link,
                  numComments:
                    action.updateType === 'increase'
                      ? link.numComments + 1
                      : link.numComments - 1
                }
              : link
          )
        }
      };
    case 'UPLOAD_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          links: [action.linkItem].concat(state.links.links)
        }
      };
    default:
      return state;
  }
}
