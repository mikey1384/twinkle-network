export default function ExploreReducer(state, action) {
  switch (action.type) {
    case 'LOAD_FEATURED_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          featured: action.subjects,
          loaded: true
        }
      };
    case 'RELOAD_SUBJECTS':
      return {
        ...state,
        subjects: {
          ...state.subjects,
          loaded: false
        }
      };
    default:
      return state;
  }
}
