export default function VideoReducer(state, action) {
  switch (action.type) {
    case 'ENTER_COMMENT':
      return {
        ...state,
        [action.contentType + action.contentId]: action.text
      };
    default:
      return state;
  }
}
