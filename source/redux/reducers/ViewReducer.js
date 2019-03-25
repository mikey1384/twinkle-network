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
    default:
      return state;
  }
}
