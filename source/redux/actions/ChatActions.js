import CHAT from '../constants/Chat';

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

export const clearChatSearchResults = () => ({
  type: CHAT.CLEAR_CHAT_SEARCH_RESULTS
});

export const clearSubjectSearchResults = () => ({
  type: CHAT.CLEAR_SUBJECT_SEARCH_RESULTS
});

export const clearUserSearchResults = () => ({
  type: CHAT.CLEAR_USER_SEARCH_RESULTS
});

export const createNewChannel = data => ({
  type: CHAT.CREATE_NEW_CHANNEL,
  data
});

export const onDeleteMessage = messageId => ({
  type: CHAT.DELETE_MESSAGE,
  messageId
});

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

export const onEditChannelTitle = params => ({
  type: CHAT.APPLY_CHANGED_CHANNEL_TITLE,
  data: params
});

export const onEditMessage = ({ editedMessage, messageId }) => ({
  type: CHAT.EDIT_MESSAGE,
  data: { editedMessage, messageId }
});

export const enterEmptyChat = () => ({
  type: CHAT.ENTER_EMPTY_CHAT
});

export const onGetNumberOfUnreadMessages = numUnreads => ({
  type: CHAT.GET_NUM_UNREAD_MSGS,
  numUnreads
});

export const onHideChat = channelId => ({
  type: CHAT.HIDE_CHAT,
  channelId
});

export const increaseNumberOfUnreadMessages = () => ({
  type: CHAT.INCREASE_NUM_UNREAD_MSGS
});

export const initChat = data => ({
  type: CHAT.INIT,
  data
});

export const onInviteUsersToChannel = data => ({
  type: CHAT.INVITE_USERS_TO_CHANNEL,
  data
});

export const onLoadChatSubject = data => ({
  type: CHAT.LOAD_SUBJECT,
  subject: data
});

export const onLoadMoreChannels = data => ({
  type: CHAT.LOAD_MORE_CHANNELS,
  data
});

export const onLoadMoreMessages = data => ({
  type: CHAT.LOAD_MORE_MESSAGES,
  data
});

export const onLeaveChannel = channelId => ({
  type: CHAT.LEAVE_CHANNEL,
  channelId
});

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

export const onReceiveMessage = ({ pageVisible, message }) => ({
  type: CHAT.RECEIVE_MESSAGE,
  pageVisible,
  message: {
    ...message,
    timeStamp: Math.floor(Date.now() / 1000)
  }
});

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

export const onReloadChatSubject = ({ subject, message }) => ({
  type: CHAT.RELOAD_SUBJECT,
  subject,
  message
});

export const resetChat = () => ({
  type: CHAT.RESET
});

export const onSearchChat = data => ({
  type: CHAT.SEARCH,
  data
});

export const onSearchChatSubject = data => ({
  type: CHAT.SEARCH_SUBJECT,
  data
});

export const onSearchUserToInvite = data => ({
  type: CHAT.SEARCH_USERS_FOR_CHANNEL,
  data
});

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

export const onSaveMessage = ({ index, messageId }) => ({
  type: CHAT.ADD_ID_TO_NEW_MESSAGE,
  messageIndex: index,
  messageId
});

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

export const onUploadChatSubject = data => ({
  type: CHAT.NEW_SUBJECT,
  data
});
