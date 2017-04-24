const defaultState = {
  profilePage: {}
}

function isAdmin(userType) {
  return userType === 'master'
}

export default function UserReducer(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_SESSION':
      return (action.data !== undefined && action.data.loggedIn) ?
      {
        ...state,
        ...action.data,
        isAdmin: isAdmin(action.data.userType)
      } : state
    case 'SHOW_USER_NOT_EXISTS':
      return {
        ...state,
        profilePage: {
          unavailable: true
        }
      }
    case 'SHOW_USER_PROFILE':
      return {
        ...state,
        profilePage: {
          ...action.data
        }
      }
    case 'SIGNIN_LOGIN':
      return {
        ...state,
        ...action.data,
        loggedIn: true,
        signinModalShown: false,
        isAdmin: isAdmin(action.data.userType)
      }
    case 'SIGNIN_LOGOUT':
      return {
        profilePage: {
          ...state.profilePage
        }
      }
    case 'SIGNIN_SIGNUP':
      return {
        ...state,
        ...action.data,
        isAdmin: isAdmin(action.data.userType),
        loggedIn: true,
        signinModalShown: false
      }
    case 'SIGNIN_OPEN':
      return {
        ...state,
        signinModalShown: true
      }
    case 'SIGNIN_CLOSE':
      return {
        ...state,
        signinModalShown: false
      }
    case 'UPDATE_BIO':
      return {
        ...state,
        profilePage: {
          ...state.profilePage,
          ...action.data
        }
      }
    case 'UPDATE_PROFILE_PICTURE':
      return {
        ...state,
        profilePicId: action.data,
        profilePage: {
          ...state.profilePage,
          profilePicId: action.data
        }
      }
    case 'UNMOUNT_PROFILE':
      return {
        ...state,
        profilePage: {}
      }
    default:
      return state
  }
}
