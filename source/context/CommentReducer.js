export default function CommentReducer(state, action) {
  switch (action.type) {
    case 'ENTER_COMMENT':
      return {
        ...state,
        [action.contentId]: action.text
      };
    default:
      return state;
  }
}
