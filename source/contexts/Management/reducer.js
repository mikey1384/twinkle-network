export default function ManagementReducer(state, action) {
  switch (action.type) {
    case 'ADD_ACCOUNT_TYPE':
      return {
        ...state,
        accountTypes: state.accountTypes.concat(action.accountType)
      };
    case 'ADD_MODERATORS':
      return {
        ...state,
        moderators: state.moderators.concat(action.newModerators)
      };
    case 'CHANGE_MODERATOR_ACCOUNT_TYPE':
      return {
        ...state,
        moderators: action.selectedAccountType
          ? state.moderators.map(moderator =>
              moderator.id === action.userId
                ? {
                    ...moderator,
                    userType: action.selectedAccountType
                  }
                : moderator
            )
          : state.moderators.filter(moderator => moderator.id !== action.userId)
      };
    case 'DELETE_ACCOUNT_TYPE':
      return {
        ...state,
        accountTypes: state.accountTypes.filter(
          accountType => accountType.label !== action.accountTypeLabel
        ),
        moderators: state.moderators.filter(
          moderator => moderator.userType !== action.accountTypeLabel
        )
      };
    case 'EDIT_ACCOUNT_TYPE':
      return {
        ...state,
        accountTypes: state.accountTypes.map(accountType =>
          accountType.label === action.label
            ? {
                ...accountType,
                ...action.editedAccountType
              }
            : accountType
        ),
        moderators: state.moderators.map(moderator => {
          return {
            ...moderator,
            userType:
              moderator.userType === action.label
                ? action.editedAccountType.label
                : moderator.userType
          };
        })
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
