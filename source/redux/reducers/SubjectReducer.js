import SUBJECT from '../constants/Subject';

const defaultState = {
  featuredSubjects: [],
  loaded: false
};

export default function SubjectReducer(state = defaultState, action) {
  switch (action.type) {
    case SUBJECT.CLEAR_LOADED:
      return {
        ...state,
        loaded: false
      };
    case SUBJECT.LOAD_FEATURED_SUBJECTS:
      return {
        ...state,
        featuredSubjects: action.challenges,
        loaded: true
      };
    default:
      return state;
  }
}
