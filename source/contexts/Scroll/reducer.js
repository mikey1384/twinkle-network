export default function ScrollReducer(state, action) {
  switch (action.type) {
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
