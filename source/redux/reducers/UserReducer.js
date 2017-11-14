const defaultState = {
  isAdmin: false,
  isCreator: false,
  profile: {},
  profiles: [],
  searchedProfiles: [],
  loadMoreButton: false
}

function isAdmin(userType) {
  const admin = ['manager', 'creator']
  return admin.indexOf(userType) !== -1
}

export default function UserReducer(state = defaultState, action) {
  let loadMoreButton = false
  switch (action.type) {
    case 'CLEAR_USER_SEARCH':
      return {
        ...state,
        searchedProfiles: []
      }
    case 'FETCH_SESSION':
      return (action.data !== undefined && action.data.loggedIn) ? {
        ...state,
        ...action.data,
        isAdmin: isAdmin(action.data.userType),
        isCreator: action.data.userType === 'creator'
      } : state
    case 'FETCH_USERS':
      if (action.data.length > 20) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        profiles: action.data,
        loadMoreButton
      }
    case 'FETCH_MORE_USERS':
      if (action.data.length > 5) {
        action.data.pop()
        loadMoreButton = true
      }
      return {
        ...state,
        profiles: state.profiles.concat(action.data),
        loadMoreButton
      }
    case 'SEARCH_USERS':
      return {
        ...state,
        searchedProfiles: action.users
      }
    case 'SHOW_USER_NOT_EXISTS':
      return {
        ...state,
        profile: {
          unavailable: true
        }
      }
    case 'SHOW_USER_PROFILE':
      return {
        ...state,
        profile: {
          ...action.data
        }
      }
    case 'SIGNIN_LOGIN':
      return {
        ...state,
        ...action.data,
        loggedIn: true,
        signinModalShown: false,
        isAdmin: isAdmin(action.data.userType),
        isCreator: action.data.userType === 'creator'
      }
    case 'SIGNIN_LOGOUT':
      return {
        isAdmin: false,
        isCreator: false,
        profile: state.profile,
        profiles: state.profiles
      }
    case 'SIGNIN_SIGNUP':
      return {
        ...state,
        ...action.data,
        isAdmin: isAdmin(action.data.userType),
        isCreator: action.data.userType === 'creator',
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
        profile: {
          ...state.profile,
          ...action.data
        }
      }
    case 'UPDATE_PROFILE_PICTURE':
      return {
        ...state,
        profilePicId: action.data.imageId,
        profile: {
          ...state.profile,
          profilePicId: action.data.imageId
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          profilePicId: profile.id === action.data.userId ? action.data.imageId : profile.profilePicId
        }))
      }
    case 'UNMOUNT_PROFILE':
      return {
        ...state,
        profile: {}
      }
    default:
      return state
  }
}
