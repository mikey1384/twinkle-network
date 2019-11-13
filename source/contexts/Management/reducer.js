export default function ManagementReducer(state, action) {
  switch (action.type) {
    case 'LOAD_MANAGEMENT':
      return {
        ...state,
        loaded: true
      };
    default:
      return state;
  }
}
