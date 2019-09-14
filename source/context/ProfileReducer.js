export default function ProfileReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  switch (action.type) {
    case 'DELETE_FEED':
      return {
        ...state,
        notables: {
          ...state.notables,
          feeds: state.notables.feeds.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          )
        },
        posts: {
          ...state.posts,
          all: state.posts.all.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          ),
          comments: state.posts.comments.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          ),
          likes: state.posts.likes.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          ),
          subjects: state.posts.subjects.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          ),
          videos: state.posts.videos.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          ),
          links: state.posts.links.filter(
            feed => feed.contentType + feed.contentId !== contentKey
          )
        }
      };
    case 'LOAD_NOTABLES':
      return {
        ...state,
        notables: {
          ...state.notables,
          feeds: action.feeds,
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_NOTABLES':
      return {
        ...state,
        notables: {
          ...state.notables,
          feeds: state.notables.feeds.concat(action.feeds),
          loadMoreButton: action.loadMoreButton
        }
      };
    case 'LOAD_POSTS':
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.section]: action.feeds,
          [`${action.section}Loaded`]: true,
          [`${action.section}LoadMoreButton`]: action.loadMoreButton
        }
      };
    case 'LOAD_MORE_POSTS':
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.section]: state.posts[action.section].concat(action.feeds),
          [`${action.section}LoadMoreButton`]: action.loadMoreButton
        }
      };
    default:
      return state;
  }
}
