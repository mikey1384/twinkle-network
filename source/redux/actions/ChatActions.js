import request from 'axios';
import { GENERAL_CHAT_ID } from 'constants/database';
import { auth, handleError, loadChatChannel } from 'helpers/requestHelpers';
import CHAT from '../constants/Chat';
import URL from 'constants/URL';

const API_URL = `${URL}/chat`;

export const clearChatLoadedState = () => ({
  type: CHAT.CLEAR_LOADED_STATE
});

export const clearNumUnreads = () => ({
  type: CHAT.CLEAR_NUM_UNREADS
});

export const clearRecentChessMessage = () => ({
  type: CHAT.CLEAR_RECENT_CHESS_MESSAGE
});

export const openNewChatTab = ({ user, recepient }) => ({
  type: CHAT.OPEN_NEW_TAB,
  user,
  recepient
});

export const changeChatSubject = subject => ({
  type: CHAT.CHANGE_SUBJECT,
  subject
});

export const enterChannelWithId = ({ data, showOnTop }) => ({
  type: CHAT.ENTER_CHANNEL,
  data,
  showOnTop
});

export const resetMsgUnreadsOnTabSwitch = () => ({
  type: CHAT.RESET_MSG_UNREADS_ON_TAB_SWITCH
});

export const clearChatSearchResults = () => ({
  type: CHAT.CLEAR_CHAT_SEARCH_RESULTS
});

export const clearSubjectSearchResults = () => ({
  type: CHAT.CLEAR_SUBJECT_SEARCH_RESULTS
});

export const clearUserSearchResults = () => ({
  type: CHAT.CLEAR_USER_SEARCH_RESULTS
});

export const createNewChannel = params => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/channel`,
      { params },
      auth()
    );
    dispatch({
      type: CHAT.CREATE_NEW_CHANNEL,
      data
    });
    return Promise.resolve(data);
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const deleteMessage = ({
  fileName = '',
  filePath = '',
  messageId
}) => async dispatch => {
  try {
    await request.delete(
      `${API_URL}/message?messageId=${messageId}&filePath=${filePath}&fileName=${fileName}`,
      auth()
    );
    dispatch({
      type: CHAT.DELETE_MESSAGE,
      messageId
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const displayAttachedFile = ({
  channelId,
  filePath,
  userId,
  username,
  profilePicId,
  scrollAtBottom,
  uploaderAuthLevel
}) => {
  return {
    type: CHAT.DISPLAY_ATTACHED_FILE,
    channelId,
    filePath,
    fileInfo: {
      userId,
      username,
      profilePicId,
      scrollAtBottom,
      uploaderAuthLevel
    }
  };
};

export const editChannelTitle = params => async dispatch => {
  try {
    await request.post(`${API_URL}/title`, params, auth());
    dispatch({
      type: CHAT.APPLY_CHANGED_CHANNEL_TITLE,
      data: params
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editMessage = ({ editedMessage, messageId }) => async dispatch => {
  try {
    await request.put(
      `${API_URL}/message`,
      { editedMessage, messageId },
      auth()
    );
    dispatch({
      type: CHAT.EDIT_MESSAGE,
      data: { editedMessage, messageId }
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const enterEmptyChat = () => ({
  type: CHAT.ENTER_EMPTY_CHAT
});

export const getNumberOfUnreadMessages = () => async dispatch => {
  if (auth() === null) return;
  try {
    const { data } = await request.get(`${API_URL}/numUnreads`, auth());
    dispatch({
      type: CHAT.GET_NUM_UNREAD_MSGS,
      numUnreads: data.numUnreads
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const hideChat = channelId => async dispatch => {
  try {
    await request.post(`${API_URL}/hideChat`, { channelId }, auth());
    dispatch({
      type: CHAT.HIDE_CHAT,
      channelId
    });
    const data = await loadChatChannel({
      channelId: GENERAL_CHAT_ID,
      dispatch
    });
    dispatch(enterChannelWithId({ data, showOnTop: true }));
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const increaseNumberOfUnreadMessages = () => ({
  type: CHAT.INCREASE_NUM_UNREAD_MSGS
});

export const initChat = data => ({
  type: CHAT.INIT,
  data
});

export const inviteUsersToChannel = params => async dispatch => {
  try {
    const {
      data: { message }
    } = await request.post(`${API_URL}/invite`, params, auth());
    dispatch({
      type: CHAT.INVITE_USERS_TO_CHANNEL,
      data: {
        ...params,
        message
      }
    });
    return Promise.resolve(message);
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadChatSubject = () => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}/chatSubject`);
    dispatch({
      type: CHAT.LOAD_SUBJECT,
      subject: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMoreChannels = ({
  currentChannelId,
  channelIds
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/more/channels?currentChannelId=${currentChannelId}&${channelIds}`,
      auth()
    );
    dispatch({
      type: CHAT.LOAD_MORE_CHANNELS,
      data
    });
    Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMoreMessages = ({
  userId,
  messageId,
  channelId
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/more/messages?userId=${userId}&messageId=${messageId}&channelId=${channelId}`,
      auth()
    );
    dispatch({
      type: CHAT.LOAD_MORE_MESSAGES,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const leaveChannel = channelId => async dispatch => {
  const timeStamp = Math.floor(Date.now() / 1000);
  try {
    await request.delete(
      `${API_URL}/channel?channelId=${channelId}&timeStamp=${timeStamp}`,
      auth()
    );
    dispatch({
      type: CHAT.LEAVE_CHANNEL,
      channelId
    });
    const data = await loadChatChannel({
      channelId: GENERAL_CHAT_ID,
      dispatch
    });
    dispatch(enterChannelWithId({ data, showOnTop: true }));
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const notifyThatMemberLeftChannel = data => ({
  type: CHAT.NOTIFY_MEMBER_LEFT,
  data
});

export const openDirectMessageChannel = ({ user, recepient, channelData }) => ({
  type: CHAT.OPEN_DM,
  user,
  recepient,
  ...channelData
});

export const postFileUploadStatus = ({
  channelId,
  content,
  fileName,
  filePath,
  fileToUpload
}) => ({
  type: CHAT.POST_FILE_UPLOAD_STATUS,
  channelId,
  file: {
    content,
    fileName,
    filePath,
    fileToUpload
  }
});

export const postUploadComplete = ({ channelId, messageId, path, result }) => ({
  type: CHAT.POST_UPLOAD_COMPLETE,
  channelId,
  messageId,
  path,
  result
});

export const receiveMessage = ({ message, pageVisible }) => async dispatch => {
  const { channelId } = message;
  try {
    await request.post(`${API_URL}/lastRead`, { channelId }, auth());
    dispatch({
      type: CHAT.RECEIVE_MESSAGE,
      pageVisible,
      message: {
        ...message,
        timeStamp: Math.floor(Date.now() / 1000)
      }
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const receiveMessageOnDifferentChannel = ({
  channel,
  senderIsNotTheUser,
  pageVisible
}) => ({
  type: CHAT.RECEIVE_MSG_ON_DIFF_CHANNEL,
  channel,
  senderIsNotTheUser,
  pageVisible
});

export const receiveFirstMsg = ({ data, duplicate, pageVisible }) => ({
  type: CHAT.RECEIVE_FIRST_MSG,
  data,
  duplicate,
  pageVisible
});

export const reloadChatSubject = subjectId => async dispatch => {
  try {
    const {
      data: { subject, message }
    } = await request.put(
      `${API_URL}/chatSubject/reload`,
      { subjectId },
      auth()
    );
    dispatch({
      type: CHAT.RELOAD_SUBJECT,
      subject,
      message
    });
    return Promise.resolve({ subject, message });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const resetChat = () => ({
  type: CHAT.RESET
});

export const searchChat = text => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/search/chat?text=${text}`,
      auth()
    );
    dispatch({
      type: CHAT.SEARCH,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const searchChatSubject = text => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/search/subject?text=${text}`
    );
    dispatch({
      type: CHAT.SEARCH_SUBJECT,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const searchUserToInvite = text => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}/search/users?text=${text}`);
    dispatch({
      type: CHAT.SEARCH_USERS_FOR_CHANNEL,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const sendFirstDirectMessage = ({ members, message }) => ({
  type: CHAT.CREATE_NEW_DM_CHANNEL,
  members,
  message
});

export const submitMessage = params => ({
  type: CHAT.SUBMIT_MESSAGE,
  message: {
    ...params,
    timeStamp: Math.floor(Date.now() / 1000)
  }
});

export const saveMessage = ({ message, index }) => async dispatch => {
  try {
    const { data } = await request.post(API_URL, { message }, auth());
    dispatch({
      type: CHAT.ADD_ID_TO_NEW_MESSAGE,
      messageIndex: index,
      messageId: data.messageId
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const updateApiServerToS3Progress = ({ progress, channelId, path }) => ({
  type: CHAT.UPDATE_API_SERVER_TO_S3_PROGRESS,
  progress,
  channelId,
  path
});

export const updateClientToApiServerProgress = ({
  progress,
  channelId,
  path
}) => {
  return {
    type: CHAT.UPDATE_CLIENT_TO_API_SERVER_PROGRESS,
    progress,
    channelId,
    path
  };
};

export const updateChessMoveViewTimeStamp = () => ({
  type: CHAT.UPDATE_CHESS_MOVE_VIEW_STAMP
});

export const updateRecentChessMessage = message => ({
  type: CHAT.UPDATE_RECENT_CHESS_MESSAGE,
  message
});

export const updateSelectedChannelId = channelId => ({
  type: CHAT.UPDATE_SELECTED_CHANNEL_ID,
  channelId
});

export const uploadChatSubject = content => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/chatSubject`,
      { content },
      auth()
    );
    dispatch({
      type: CHAT.NEW_SUBJECT,
      data
    });
    return Promise.resolve(data.subjectId);
  } catch (error) {
    handleError(error, dispatch);
  }
};
