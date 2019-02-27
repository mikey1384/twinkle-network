import VIEW from '../constants/View';

const defaultState = {
  mobileNavbarShown: true,
  pageVisible: true
};

export default function ViewReducer(state = defaultState, action) {
  switch (action.type) {
    case VIEW.CHANGE_PAGE_VISIBILITY:
      return {
        ...state,
        pageVisible: action.visible
      };
    case VIEW.HIDE_MOBILE_NAVBAR:
      return {
        ...state,
        mobileNavbarShown: false
      };
    case VIEW.SHOW_MOBILE_NAVBAR:
      return {
        ...state,
        mobileNavbarShown: true
      };
    default:
      return state;
  }
}
