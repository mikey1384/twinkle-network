export default function InputReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_PAGE_VISIBILITY':
      return {
        ...state,
        pageVisible: action.visible
      };
    case 'RECORD_SCROLL_POSITION':
      return {
        ...state,
        scrollPositions: {
          ...state.scrollPositions,
          [action.section]: action.position
        }
      };
    default:
      return state;
  }
}
