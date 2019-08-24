import VIEW from '../constants/View';

const defaultState = {
  mobileNavbarShown: true,
  pageVisible: true,
  scrollPositions: {
    // here
    home: 0,
    subjects: 0,
    videos: 0,
    links: 0,
    talk: 0,
    users: 0
  }
};

export default function ViewReducer(state = defaultState, action) {
  switch (action.type) {
    case VIEW.CHANGE_PAGE_VISIBILITY:
      return {
        ...state,
        pageVisible: action.visible
      };
    case VIEW.RECORD_SCROLL_POSITION:
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
