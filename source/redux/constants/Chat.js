const types = {
  ADD_ID_TO_NEW_MESSAGE: 'ADD_ID_TO_NEW_MESSAGE',
  APPLY_CHANGED_CHANNEL_TITLE: 'APPLY_CHANGED_CHANNEL_TITLE',
  CHANGE_SUBJECT: 'CHANGE_SUBJECT',
  CLEAR_CHAT_SEARCH_RESULTS: 'CLEAR_CHAT_SEARCH_RESULTS',
  CLEAR_SUBJECT_SEARCH_RESULTS: 'CLEAR_SUBJECT_SEARCH_RESULTS',
  CLEAR_USER_SEARCH_RESULTS: 'CLEAR_USER_SEARCH_RESULTS',
  CLOSE: 'CLOSE',
  CREATE_NEW_CHANNEL: 'CREATE_NEW_CHANNEL',
  CREATE_NEW_DM_CHANNEL: 'CREATE_NEW_DM_CHANNEL',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  EDIT_MESSAGE: 'EDIT_MESSAGE',
  ENTER_CHANNEL: 'ENTER_CHANNEL',
  ENTER_EMPTY_CHAT: 'ENTER_EMPTY_CHAT',
  GET_NUM_UNREAD_MSGS: 'GET_NUM_UNREAD_MSGS',
  HIDE_CHAT: 'HIDE_CHAT',
  INCREASE_NUM_UNREAD_MSGS: 'INCREASE_NUM_UNREAD_MSGS',
  INIT: 'INIT',
  INVITE_USERS_TO_CHANNEL: 'INVITE_USERS_TO_CHANNEL',
  LEAVE_CHANNEL: 'LEAVE_CHANNEL',
  LOAD_MORE_CHANNELS: 'LOAD_MORE_CHANNELS',
  LOAD_MORE_MESSAGES: 'LOAD_MORE_MESSAGES',
  LOAD_SUBJECT: 'LOAD_SUBJECT',
  NEW_SUBJECT: 'NEW_SUBJECT',
  NOTIFY_MEMBER_LEFT: 'NOTIFY_MEMBER_LEFT',
  OPEN_DM: 'OPEN_DM',
  OPEN_NEW_TAB: 'OPEN_NEW_TAB',
  POST_FILE_UPLOAD_STATUS: 'POST_FILE_UPLOAD_STATUS',
  POST_UPLOAD_COMPLETE: 'POST_UPLOAD_COMPLETE',
  RECEIVE_FIRST_MSG: 'RECEIVE_FIRST_MSG',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  RECEIVE_MSG_ON_DIFF_CHANNEL: 'RECEIVE_MSG_ON_DIFF_CHANNEL',
  RELOAD_SUBJECT: 'RELOAD_SUBJECT',
  RESET: 'RESET',
  RESET_MSG_UNREADS_ON_TAB_SWITCH: 'RESET_MSG_UNREADS_ON_TAB_SWITCH',
  SEARCH: 'SEARCH',
  SEARCH_SUBJECT: 'SEARCH_SUBJECT',
  SEARCH_USERS_FOR_CHANNEL: 'SEARCH_USERS_FOR_CHANNEL',
  SELECT_CHANNEL: 'SELECT_CHANNEL',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
  UPDATE_API_SERVER_TO_S3_PROGRESS: 'UPDATE_API_SERVER_TO_S3_PROGRESS',
  UPDATE_CLIENT_TO_API_SERVER_PROGRESS: 'UPDATE_CLIENT_TO_API_SERVER_PROGRESS',
  UPDATE_CHESS_MOVE_VIEW_STAMP: 'UPDATE_CHESS_MOVE_VIEW_STAMP'
};

for (let key in types) {
  types[key] = `${types[key]}_CHAT`;
}

export default types;
