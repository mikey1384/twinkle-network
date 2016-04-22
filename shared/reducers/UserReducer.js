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
  return (userType === 'teacher' || userType === 'master') ? true : false;
}

export default function UserReducer(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_SESSION':
    if (action.res.data.loggedIn) {
      return {
        ...state,
        loggedIn: true,
        username: action.res.data.username,
        userType: action.res.data.usertype,
        isAdmin: isAdmin(action.res.data.usertype),
        userId: action.res.data.userId
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
    if (action.res.data.result === 'success') {
      return {
        ...state,
        loggedIn: true,
        username: action.res.data.username,
        userType: action.res.data.usertype,
        isAdmin: isAdmin(action.res.data.usertype),
        userId: action.res.data.userId,
        signinModalShown: false
      }
    } else {
      return {
        ...state,
        loginError: action.res.data.result
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
    if (action.res.data.result === 'success') {
      return {
        ...state,
        loggedIn: true,
        username: action.res.data.username,
        userType: action.res.data.usertype,
        isAdmin: isAdmin(action.res.data.usertype),
        userId: action.res.data.userId,
        signinModalShown: false
      }
    } else {
      return {
        ...state,
        signupError: action.res.data.result
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
