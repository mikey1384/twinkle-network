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
  const data = action.res ? action.res.data : null;
  switch (action.type) {
    case 'FETCH_SESSION':
    if (data.loggedIn) {
      return {
        ...state,
        loggedIn: true,
        username: data.username,
        userType: data.usertype,
        isAdmin: isAdmin(data.usertype),
        userId: data.userId
      }
    } else {
      return {
        ...state,
        loggedIn: false
      }
    }
    case 'SIGNIN_LOGIN':
    if (data.result === 'success') {
      return {
        ...state,
        loggedIn: true,
        username: data.username,
        userType: data.usertype,
        isAdmin: isAdmin(data.usertype),
        userId: data.userId,
        signinModalShown: false
      }
    } else {
      return {
        ...state,
        loginError: data.result
      }
    }
    case 'SIGNIN_LOGOUT':
    if (data.result === 'success') {
      return {
        ...state,
        loggedIn: false,
        username: null,
        userType: null,
        isAdmin: false,
        userId: null
      }
    } else {
      return state;
    }
    case 'SIGNIN_SIGNUP':
    if (data.result === 'success') {
      return {
        ...state,
        loggedIn: true,
        username: data.username,
        userType: data.usertype,
        isAdmin: isAdmin(data.usertype),
        userId: data.userId,
        signinModalShown: false
      }
    } else {
      return {
        ...state,
        signupError: data.result
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
