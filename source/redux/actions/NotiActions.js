import NOTI from '../constants/Noti';

export const changeSocketStatus = connected => ({
  type: NOTI.CHANGE_SOCKET_STATUS,
  connected
});

export const onCheckVersion = data => ({
  type: NOTI.CHECK_VERSION,
  data
});

export const clearRewards = () => ({
  type: NOTI.CLEAR_REWARDS
});

export const clearNotifications = () => ({
  type: NOTI.CLEAR
});

export const changeRankingsLoadedStatus = loaded => ({
  type: NOTI.CHANGE_RANKINGS_LOADED,
  loaded
});

export const onFetchNotifications = data => ({
  type: NOTI.LOAD,
  data
});

export const getRanks = ({ all, top30s, rankModifier }) => ({
  type: NOTI.LOAD_RANKS,
  all,
  top30s,
  rankModifier
});

export const onLoadMoreNotifications = data => ({
  type: NOTI.LOAD_MORE,
  data
});

export const onLoadMoreRewards = data => ({
  type: NOTI.LOAD_MORE_REWARDS,
  data
});

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
