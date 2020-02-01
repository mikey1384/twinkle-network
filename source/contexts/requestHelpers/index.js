import chatRequestHelpers from './chat';
import contentRequestHelpers from './content';
import notificationRequestHelpers from './notification';
import userRequestHelpers from './user';

const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

const auth = () => ({
  headers: {
    authorization: token()
  }
});

export default function requestHelpers(handleError) {
  return {
    auth,
    ...contentRequestHelpers({ auth, handleError }),
    ...notificationRequestHelpers({ auth, handleError }),
    ...userRequestHelpers({ auth, handleError, token }),
    ...chatRequestHelpers({ auth, handleError })
  };
}
