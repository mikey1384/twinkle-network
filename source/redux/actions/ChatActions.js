import CHAT from '../constants/Chat';

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
