export default function ManagementReducer(state, action) {
  switch (action.type) {
    case 'LOAD_MANAGEMENT':
      return {
        ...state,
        loaded: true
      };
    case 'LOAD_MODERATORS':
      return {
        ...state,
        moderators: action.moderators,
        moderatorsLoaded: true
      };
    default:
      return state;
  }
}
