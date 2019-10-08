export default function ExploreReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_PLAYLIST_VIDEOS':
      return {
        ...state,
        videos: {
          ...state.videos,
          featuredPlaylists: state.videos.featuredPlaylists.map(playlist =>
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
    case 'CHANGE_FEATURED_PLAYLISTS':
      return {
        ...state,
        videos: {
          ...state.videos,
          featuredPlaylists: action.data
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
          featuredPlaylists: state.videos.featuredPlaylists.map(playlist => ({
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
          selectPlaylistsToFeatureModalShown: false
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
          featuredPlaylists: state.videos.featuredPlaylists.filter(
            playlist => playlist.id !== action.playlistId
          ),
          allPlaylists: state.videos.allPlaylists.filter(
            playlist => playlist.id !== action.playlistId
          ),
          searchedPlaylists: state.videos.searchedPlaylists.filter(
            playlist => playlist.id !== action.playlistId
          )
        }
      };
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          featured: state.subjects.featured.filter(
            subject => subject.id !== action.subjectId
          )
        }
      };
    case 'DELETE_VIDEO':
      return {
        ...state,
        videos: {
          ...state.videos,
          featuredPlaylists: state.videos.featuredPlaylists.map(playlist => ({
            ...playlist,
            playlist: playlist.playlist.filter(
              video => video.videoId !== action.videoId
            )
          })),
          allPlaylists: state.videos.allPlaylists.map(playlist => ({
            ...playlist,
            playlist: playlist.playlist.filter(
              video => video.videoId !== action.videoId
            )
          })),
          searchedPlaylists: state.videos.searchedPlaylists.map(playlist => ({
            ...playlist,
            playlist: playlist.playlist.filter(
              video => video.videoId !== action.videoId
            )
          }))
        }
      };
    case 'EDIT_LINK_PAGE':
      return {
        ...state,
        links: {
          ...state.links,
          links: state.links.links.map(link =>
            link.id === action.id
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
          featuredPlaylists: state.videos.featuredPlaylists.map(playlist => ({
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
          featuredPlaylists: state.videos.featuredPlaylists.map(playlist => ({
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
        ...state,
        videos: {
          ...state.videos,
          currentVideoSlot: null
        }
      };
    case 'FILL_CURRENT_VIDEO_SLOT':
      return {
        ...state,
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
    case 'LIKE_VIDEO':
      return {
        ...state,
        videos: {
          ...state.videos,
          allVideoThumbs: state.allVideoThumbs.map(video => {
            return video.id === action.videoId
              ? {
                  ...video,
                  likes: action.likes
                }
              : video;
          }),
          featuredPlaylists: state.featuredPlaylists.map(playlist => ({
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
          featuredPlaylists: action.playlists,
          featuredPlaylistsLoaded: true
        }
      };
    case 'LOAD_PLAYLISTS':
      return {
        ...state,
        videos: {
          ...state.videos,
          allPlaylistsLoaded: true,
          allPlaylists: action.playlists,
          loadMorePlaylistsButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_PLAYLISTS':
      return {
        ...state,
        videos: {
          ...state.videos,
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
    case 'OPEN_PLAYLIST_MODAL':
      return {
        ...state,
        videos: {
          ...state.videos,
          addPlaylistModalShown: true
        }
      };
    case 'OPEN_REORDER_PINNED_PL_MODAL':
      return {
        ...state,
        videos: {
          ...state.videos,
          reorderFeaturedPlaylistsShown: true
        }
      };
    case 'OPEN_SELECT_PL_TO_PIN_MODAL': {
      let loadMorePlaylistsToPinButton = false;
      if (action.data.result.length > 10) {
        action.data.result.pop();
        loadMorePlaylistsToPinButton = true;
      }
      return {
        ...state,
        videos: {
          ...state.videos,
          playlistsToPin: action.data.result.map(item => ({
            title: item.title,
            id: item.id
          })),
          loadMorePlaylistsToPinButton,
          selectPlaylistsToFeatureModalShown: true
        }
      };
    }
    case 'RELOAD_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          loaded: false
        }
      };
    case 'SET_REWARD_LEVEL':
      return {
        ...state,
        videos: {
          ...state.videos,
          featuredPlaylists: state.videos.featuredPlaylists.map(playlist => ({
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
          allPlaylists: state.videos.allPlaylists.map(playlist => ({
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
          searchedPlaylists: state.videos.searchedPlaylists.map(playlist => ({
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
        }
      };
    case 'SET_SEARCHED_PLAYLISTS':
      return {
        ...state,
        videos: {
          ...state.videos,
          searchedPlaylists: action.playlists,
          loadMoreSearchedPlaylistsButton: action.loadMoreButton
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
          links: [
            {
              id: action.linkItem.contentId,
              content: action.linkItem.content,
              likes: [],
              timeStamp: action.linkItem.lastInteraction,
              title: action.linkItem.title,
              uploader: action.linkItem.uploader
            }
          ].concat(state.links.links)
        }
      };
    case 'UPLOAD_PLAYLIST':
      return {
        ...state,
        videos: {
          ...state.videos,
          allPlaylists: [action.data].concat(state.allPlaylists),
          loadMoreButton: state.loadMoreButton,
          addPlaylistModalShown: false
        }
      };
    default:
      return state;
  }
}
