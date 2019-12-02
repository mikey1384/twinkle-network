export default function ManagementReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_MODERATOR_ACCOUNT_TYPE':
      return {
        ...state,
        moderators: state.moderators.map(moderator =>
          moderator.id === action.userId
            ? {
                ...moderator,
                userType: action.selectedAccountType
              }
            : moderator
        )
      };
    case 'LOAD_ACCOUNT_TYPES':
      return {
        ...state,
        accountTypes: action.accountTypes,
        accountTypesLoaded: true
      };
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
