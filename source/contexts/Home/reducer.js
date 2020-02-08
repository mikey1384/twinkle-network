export default function HomeReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  switch (action.type) {
    case 'CHANGE_CATEGORY':
      return {
        ...state,
        category: action.category
      };
    case 'CHANGE_SUB_FILTER':
      return {
        ...state,
        subFilter: action.subFilter
      };
    case 'CLEAR_FILE_UPLOAD_PROGRESS':
      return {
        ...state,
        fileUploadProgress: null,
        fileUploadComplete: false
      };
    case 'DELETE_FEED':
      return {
        ...state,
        feeds: state.feeds.filter(
          feed => feed.contentType + feed.contentId !== contentKey
        )
      };
    case 'LOAD_FEEDS':
      return {
        ...state,
        feeds: action.feeds,
        loadMoreButton: action.loadMoreButton,
        loaded: true
      };
    case 'LOAD_MORE_FEEDS':
      return {
        ...state,
        feeds: state.feeds.concat(action.feeds),
        loadMoreButton: action.loadMoreButton
      };
    case 'LOAD_NEW_FEEDS':
      return {
        ...state,
        feeds: action.data.concat(state.feeds)
      };
    case 'RELOAD_FEEDS':
      return {
        ...state,
        loaded: false
      };
    case 'SET_DISPLAY_ORDER':
      return {
        ...state,
        displayOrder: action.order
      };
    case 'SET_FEEDS_OUTDATED':
      return {
        ...state,
        feedsOutdated: action.outdated
      };
    case 'SET_FILE_UPLOAD_COMPLETE':
      return {
        ...state,
        fileUploadComplete: true
      };
    case 'SET_SUBMITTING_SUBJECT':
      return {
        ...state,
        submittingSubject: action.submitting
      };
    case 'SET_UPLOADING_FILE':
      return {
        ...state,
        uploadingFile: action.uploading
      };
    case 'UPDATE_FILE_UPLOAD_PROGRESS':
      return {
        ...state,
        fileUploadProgress: action.progress
      };
    default:
      return state;
  }
}
