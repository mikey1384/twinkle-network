const defaultState = {
  loggedIn: false,
  username: null,
  userType: null,
  isAdmin: false,
  userId: null,
  signupError: null,
  loginError: null,
  signinModalShown: false
};

function isAdmin (userType) {
  return userType === 'teacher' || userType === 'master';
}

export default function UserReducer(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_SESSION':
    if (action.data !== undefined && action.data.loggedIn) {
      return {
        ...state,
        loggedIn: true,
        username: action.data.username,
        userType: action.data.userType,
        isAdmin: isAdmin(action.data.userType),
        userId: action.data.id
      }
    } else {
      return {
        ...state,
        loggedIn: false,
        username: null,
        userType: null,
        isAdmin: false,
        userId: null
      }
    }
    case 'SIGNIN_LOGIN':
    if (action.data.result === 'success') {
      return {
        ...state,
        loggedIn: true,
        signinModalShown: false,
        isAdmin: isAdmin(action.data.userType),
        username: action.data.username,
        userType: action.data.userType,
        userId: action.data.userId
      }
    } else {
      return {
        ...state,
        loginError: action.data.result
      }
    }
    case 'SIGNIN_LOGOUT':
    return {
      ...state,
      loggedIn: false,
      username: null,
      userType: null,
      isAdmin: false,
      userId: null
    }
    case 'SIGNIN_SIGNUP':
    if (action.data.result === 'success') {
      return {
        ...state,
        loggedIn: true,
        username: action.data.username,
        userType: action.data.userType,
        isAdmin: isAdmin(action.data.userType),
        userId: action.data.userId,
        signinModalShown: false
      }
    } else {
      return {
        ...state,
        signupError: action.data.result
      }
    };
    case 'SIGNIN_OPEN':
    return {
      ...state,
      signinModalShown: true
    };
    case 'SIGNIN_CLOSE':
    return {
      ...state,
      signupError: null,
      loginError: null,
      signinModalShown: false
    };
    case 'SIGNIN_HIDEALERT':
    return {
      ...state,
      loginError: null,
      signupError: null
    }
    default:
      return state;
  }
}
