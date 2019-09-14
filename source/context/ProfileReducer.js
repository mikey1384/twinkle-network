export default function ProfileReducer(state, action) {
  const contentKey =
    action.contentType && action.contentId
      ? action.contentType + action.contentId
      : 'temp';
  switch (action.type) {
    case 'DELETE_NOTABLE':
      return {
        ...state,
        notables: state.notables.filter(
          notable => notable.contentType + notable.contentId !== contentKey
        )
      };
    case 'LOAD_NOTABLES':
      return {
        ...state,
        notables: action.notables,
        loadMoreButton: action.loadMoreButton
      };
    case 'LOAD_MORE_NOTABLES':
      return {
        ...state,
        notables: state.notables.concat(action.notables),
        loadMoreButton: action.loadMoreButton
      };
    default:
      return state;
  }
}
