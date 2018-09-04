import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import NOTI from '../constants/Noti';

const API_URL = `${URL}/notification`;
const appVersion = '0.1.35';

export const checkVersion = () => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/version?version=${appVersion}`
    );
    dispatch({
      type: NOTI.CHECK_VERSION,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const clearRewards = () => ({
  type: NOTI.CLEAR_REWARDS
});

export const clearNotifications = () => ({
  type: NOTI.CLEAR
});

export const fetchNotifications = () => async dispatch => {
  try {
    if (auth().headers.authorization === null) {
      const { data } = await request.get(`${API_URL}/chatSubject`);
      dispatch({
        type: NOTI.LOAD,
        data: {
          notifications: [],
          rewards: [],
          totalRewardAmount: 0,
          currentChatSubject: data
        }
      });
    } else {
      const { data } = await request.get(API_URL, auth());
      dispatch({
        type: NOTI.LOAD,
        data
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMoreNotifications = lastId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/more?lastId=${lastId}`,
      auth()
    );
    dispatch({
      type: NOTI.LOAD_MORE,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMoreRewards = lastId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/more/rewards?lastId=${lastId}`,
      auth()
    );
    dispatch({
      type: NOTI.LOAD_MORE_REWARDS,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const increaseNumNewNotis = () => ({
  type: NOTI.INCREASE_NUM_NEW_NOTIS
});

export const increaseNumNewPosts = () => ({
  type: NOTI.INCREASE_NUM_NEW_POSTS
});

export const notifyChatSubjectChange = subject => ({
  type: NOTI.CHAT_SUBJECT_CHANGE,
  subject
});

export const resetNumNewPosts = () => ({
  type: NOTI.RESET_NUM_NEW_POSTS
});
