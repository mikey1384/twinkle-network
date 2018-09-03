import VIEW from '../constants/View';

const defaultState = {
  mobileNavbarShown: true,
  pageVisible: true,
  autoscrollDisabled: false
};

export default function ViewReducer(state = defaultState, action) {
  switch (action.type) {
    case VIEW.CHANGE_PAGE_VISIBILITY:
      return {
        ...state,
        pageVisible: action.visible
      };
    case VIEW.DISABLE_AUTOSCROLL:
      return {
        ...state,
        autoscrollDisabled: true
      };
    case VIEW.ENABLE_AUTOSCROLL:
      return {
        ...state,
        autoscrollDisabled: false
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
