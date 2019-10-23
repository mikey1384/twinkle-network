export default function ProfileReducer(state, action) {
  const defaultState = {
    notables: {
      feeds: [],
      loadMoreButton: false
    },
    posts: {
      all: [],
      allLoaded: false,
      allLoadMoreButton: false,
      comments: [],
      commentsLoaded: false,
      commentsLoadMoreButton: false,
      likes: [],
      likesLoaded: false,
      likesLoadMoreButton: false,
      subjects: [],
      subjectsLoaded: false,
      subjectsLoadMoreButton: false,
      videos: [],
      videosLoaded: false,
      videosLoadMoreButton: false,
      links: [],
      linksLoaded: false,
      linksLoadMoreButton: false
    }
  };
  const username = action.username;
  const prevContentState = state[action.username] || defaultState;
  switch (action.type) {
    case 'LOAD_NOTABLES':
      return {
        ...state,
        [username]: {
          ...prevContentState,
          notables: {
            ...prevContentState.notables,
            feeds: action.feeds,
            loadMoreButton: action.loadMoreButton,
            loaded: true
          }
        }
      };
    case 'LOAD_MORE_NOTABLES':
      return {
        ...state,
        [username]: {
          ...prevContentState,
          notables: {
            ...prevContentState.notables,
            feeds: prevContentState.notables.feeds.concat(action.feeds),
            loadMoreButton: action.loadMoreButton
          }
        }
      };
    case 'LOAD_POSTS':
      return {
        ...state,
        [username]: {
          ...prevContentState,
          posts: {
            ...prevContentState.posts,
            [action.section]: action.feeds,
            [`${action.section}Loaded`]: true,
            [`${action.section}LoadMoreButton`]: action.loadMoreButton
          }
        }
      };
    case 'LOAD_MORE_POSTS':
      return {
        ...state,
        [username]: {
          ...prevContentState,
          posts: {
            ...prevContentState.posts,
            [action.section]: prevContentState.posts[action.section].concat(
              action.feeds
            ),
            [`${action.section}LoadMoreButton`]: action.loadMoreButton
          }
        }
      };
    case 'RESET_PROFILE':
      return {
        ...state,
        [username]: {
          ...defaultState,
          profileId: state.profileId
        }
      };
    case 'SET_PROFILE_ID':
      return {
        ...state,
        [username]: {
          ...prevContentState,
          profileId: action.profileId
        }
      };
    case 'USER_NOT_EXIST':
      return {
        ...state,
        [username]: {
          ...prevContentState,
          notExist: true
        }
      };
    default:
      return state;
  }
}
