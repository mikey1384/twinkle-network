export default function NotiActions(dispatch) {
  return {
    onChangeSocketStatus(connected) {
      return dispatch({
        type: 'CHANGE_SOCKET_STATUS',
        connected
      });
    },
    onCheckVersion(data) {
      return dispatch({
        type: 'CHECK_VERSION',
        data
      });
    },
    onClearRewards() {
      return dispatch({
        type: 'CLEAR_REWARDS'
      });
    },
    onClearNotifications() {
      return dispatch({
        type: 'CLEAR_NOTIFICATIONS'
      });
    },
    onFetchNotifications(data) {
      return dispatch({
        type: 'LOAD_NOTIFICATIONS',
        data
      });
    },
    onGetRanks({ all, top30s, rankModifier }) {
      return dispatch({
        type: 'LOAD_RANKS',
        all,
        top30s,
        rankModifier
      });
    },
    onIncreaseNumNewNotis() {
      return dispatch({
        type: 'INCREASE_NUM_NEW_NOTIS'
      });
    },
    onIncreaseNumNewPosts() {
      return dispatch({
        type: 'INCREASE_NUM_NEW_POSTS'
      });
    },
    onLoadMoreNotifications(data) {
      return dispatch({
        type: 'LOAD_MORE_NOTIFICATIONS',
        data
      });
    },
    onLoadMoreRewards(data) {
      return dispatch({
        type: 'LOAD_MORE_REWARDS',
        data
      });
    },
    onNotifyChatSubjectChange(subject) {
      return dispatch({
        type: 'CHAT_SUBJECT_CHANGE',
        subject
      });
    },
    onResetNumNewPosts() {
      return dispatch({
        type: 'RESET_NUM_NEW_POSTS'
      });
    },
    onShowUpdateNotice(shown) {
      return dispatch({
        type: 'SHOW_UPDATE_NOTICE',
        shown
      });
    }
  };
}
