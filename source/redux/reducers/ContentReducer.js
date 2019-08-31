import CONTENT from '../constants/Content';

const defaultState = {
  commentsShown: false
};

export default function ViewReducer(state = defaultState, action) {
  switch (action.type) {
    case CONTENT.SHOW_COMMENTS:
      return {
        ...state,
        commentsShown: true
      };
    default:
      return state;
  }
}
