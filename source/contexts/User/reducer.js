import { initialUserState } from '../AppContext';

const DEFAULT_PROFILE_THEME = 'logoBlue';

export default function UserReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_DEFAULT_FILTER':
      return {
        ...state,
        defaultSearchFilter: action.filter
      };
    case 'CHANGE_PROFILE_THEME':
      return {
        ...state,
        profileTheme: action.theme,
        profile: {
          ...state.profile,
          profileTheme: action.theme
        },
        profiles: state.profiles.map(profile =>
          profile.id === action.userId
            ? { ...profile, profileTheme: action.theme }
            : profile
        )
      };
    case 'CHANGE_XP':
      return {
        ...state,
        twinkleXP: action.xp,
        rank: action.rank
      };
    case 'CLEAR_USER_SEARCH':
      return {
        ...state,
        searchedProfiles: []
      };
    case 'CLOSE_SIGNIN_MODAL':
      return {
        ...state,
        signinModalShown: false
      };
    case 'DELETE_STATUS_MSG':
      return {
        ...state,
        profile: {
          ...state.profile,
          statusMsg: '',
          statusColor: ''
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          ...(profile.id === action.userId
            ? { statusMsg: '', statusColor: '' }
            : {})
        }))
      };
    case 'EDIT_PROFILE_PICTURE':
      return {
        ...state,
        profilePicId: action.data.imageId,
        profile: {
          ...state.profile,
          profilePicId:
            state.profile.id === action.data.userId
              ? action.data.imageId
              : state.profile.profilePicId
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          profilePicId:
            profile.id === action.data.userId
              ? action.data.imageId
              : profile.profilePicId
        }))
      };
    case 'INIT_SESSION':
      return {
        ...state,
        ...action.data,
        defaultSearchFilter: action.data.searchFilter,
        profileTheme: action.data.profileTheme || DEFAULT_PROFILE_THEME,
        isCreator: action.data.userType === 'creator'
      };
    case 'LOAD_USERS': {
      let loadMoreButton = false;
      if (action.data.length > 20) {
        action.data.pop();
        loadMoreButton = true;
      }
      return {
        ...state,
        profiles: action.data,
        loadMoreButton
      };
    }
    case 'LOAD_MORE_USERS': {
      let loadMoreButton = false;
      if (action.data.length > 5) {
        action.data.pop();
        loadMoreButton = true;
      }
      return {
        ...state,
        profiles: state.profiles.concat(action.data),
        loadMoreButton
      };
    }
    case 'LOGIN':
      return {
        ...state,
        ...action.data,
        defaultSearchFilter: action.data.searchFilter,
        loggedIn: true,
        signinModalShown: false,
        profileTheme: action.data.profileTheme || DEFAULT_PROFILE_THEME,
        isCreator: action.data.userType === 'creator'
      };
    case 'LOGOUT':
      return {
        ...initialUserState,
        profile: state.profile,
        profiles: state.profiles,
        profilesLoaded: state.profilesLoaded,
        searchedProfiles: state.searchedProfiles
      };
    case 'LOGOUT_AND_OPEN_SIGNIN_MODAL':
      return {
        ...initialUserState,
        signinModalShown: true,
        profile: state.profile,
        profiles: state.profiles,
        profileLoaded: state.profilesLoaded,
        searchedProfiles: state.searchedProfiles
      };
    case 'OPEN_SIGNIN_MODAL':
      return {
        ...state,
        signinModalShown: true
      };
    case 'SEARCH_USERS':
      return {
        ...state,
        searchedProfiles: action.users
      };
    case 'SHOW_PROFILE':
      return {
        ...state,
        profile: action.data
      };
    case 'SHOW_PROFILE_COMMENTS':
      return {
        ...state,
        profiles: state.profiles.map(profile => ({
          ...profile,
          commentsShown:
            profile.id === action.profileId ? true : profile.commentsShown
        }))
      };
    case 'SIGNUP':
      return {
        ...state,
        ...action.data,
        profileTheme: DEFAULT_PROFILE_THEME,
        loggedIn: true,
        signinModalShown: false
      };
    case 'SET_PROFILES_LOADED':
      return {
        ...state,
        profilesLoaded: action.loaded
      };
    case 'TOGGLE_HIDE_WATCHED':
      return {
        ...state,
        hideWatched: action.hideWatched
      };
    case 'UPDATE_BIO':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.bio
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          ...(profile.id === action.userId ? action.bio : {})
        }))
      };
    case 'UPDATE_GREETING':
      return {
        ...state,
        profile: {
          ...state.profile,
          greeting: action.greeting
        }
      };
    case 'UPDATE_PROFILE_INFO':
      return {
        ...state,
        ...action.data,
        profile: {
          ...state.profile,
          ...action.data
        }
      };
    case 'UPDATE_STATUS_MSG':
      return {
        ...state,
        profile: {
          ...state.profile,
          statusMsg: action.statusMsg,
          statusColor: action.statusColor
        },
        profiles: state.profiles.map(profile => ({
          ...profile,
          ...(profile.id === action.userId
            ? { statusMsg: action.statusMsg, statusColor: action.statusColor }
            : {})
        }))
      };
    case 'USER_NOT_EXIST':
      return {
        ...state,
        profile: {
          unavailable: true
        }
      };
    default:
      return state;
  }
}
