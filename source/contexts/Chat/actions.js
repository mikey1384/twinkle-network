export default function ChatActions(dispatch) {
  return {
    onChangeChatSubject(subject) {
      return dispatch({
        type: 'CHANGE_SUBJECT',
        subject
      });
    },
    onSetReconnecting() {
      return dispatch({
        type: 'SET_RECONNECTING'
      });
    },
    onClearNumUnreads(channelId) {
      return dispatch({
        type: 'CLEAR_NUM_UNREADS',
        channelId
      });
    },
    onClearRecentChessMessage() {
      return dispatch({
        type: 'CLEAR_RECENT_CHESS_MESSAGE'
      });
    },
    onClearChatSearchResults() {
      return dispatch({
        type: 'CLEAR_CHAT_SEARCH_RESULTS'
      });
    },
    onClearSubjectSearchResults() {
      return dispatch({
        type: 'CLEAR_SUBJECT_SEARCH_RESULTS'
      });
    },
    onClearUserSearchResults() {
      return dispatch({
        type: 'CLEAR_USER_SEARCH_RESULTS'
      });
    },
    onCreateNewChannel(data) {
      return dispatch({
        type: 'CREATE_NEW_CHANNEL',
        data
      });
    },
    onDeleteMessage(messageId) {
      return dispatch({
        type: 'DELETE_MESSAGE',
        messageId
      });
    },
    onDisplayAttachedFile({
      channelId,
      filePath,
      userId,
      username,
      profilePicId,
      scrollAtBottom,
      uploaderAuthLevel
    }) {
      return dispatch({
        type: 'DISPLAY_ATTACHED_FILE',
        channelId,
        filePath,
        fileInfo: {
          userId,
          username,
          profilePicId,
          scrollAtBottom,
          uploaderAuthLevel
        }
      });
    },
    onEditChannelTitle(params) {
      return dispatch({
        type: 'APPLY_CHANGED_CHANNEL_TITLE',
        data: params
      });
    },
    onEditMessage({ editedMessage, messageId }) {
      return dispatch({
        type: 'EDIT_MESSAGE',
        data: { editedMessage, messageId }
      });
    },
    onEnterChannelWithId({ data, showOnTop }) {
      return dispatch({
        type: 'ENTER_CHANNEL',
        data,
        showOnTop
      });
    },
    onEnterEmptyChat() {
      return dispatch({
        type: 'ENTER_EMPTY_CHAT'
      });
    },
    onGetNumberOfUnreadMessages(numUnreads) {
      return dispatch({
        type: 'GET_NUM_UNREAD_MSGS',
        numUnreads
      });
    },
    onHideChat(channelId) {
      return dispatch({
        type: 'HIDE_CHAT',
        channelId
      });
    },
    onInitChat(data) {
      return dispatch({
        type: 'INIT_CHAT',
        data
      });
    },
    onInviteUsersToChannel(data) {
      return dispatch({
        type: 'INVITE_USERS_TO_CHANNEL',
        data
      });
    },
    onLeaveChannel(channelId) {
      return dispatch({
        type: 'LEAVE_CHANNEL',
        channelId
      });
    },
    onLoadChatSubject(data) {
      return dispatch({
        type: 'LOAD_SUBJECT',
        subject: data
      });
    },
    onLoadMoreChannels(data) {
      return dispatch({
        type: 'LOAD_MORE_CHANNELS',
        data
      });
    },
    onLoadMoreMessages(data) {
      return dispatch({
        type: 'LOAD_MORE_MESSAGES',
        data
      });
    },
    onNotifyThatMemberLeftChannel(data) {
      return dispatch({
        type: 'NOTIFY_MEMBER_LEFT',
        data
      });
    },
    onOpenDirectMessageChannel({ user, recepient, channelData }) {
      return dispatch({
        type: 'OPEN_DM',
        user,
        recepient,
        ...channelData
      });
    },
    onOpenNewChatTab({ user, recepient }) {
      return dispatch({
        type: 'OPEN_NEW_TAB',
        user,
        recepient
      });
    },
    onPostFileUploadStatus({
      channelId,
      content,
      fileName,
      filePath,
      fileToUpload
    }) {
      return dispatch({
        type: 'POST_FILE_UPLOAD_STATUS',
        channelId,
        file: {
          content,
          fileName,
          filePath,
          fileToUpload
        }
      });
    },
    onPostUploadComplete({ channelId, messageId, path, result }) {
      return dispatch({
        type: 'POST_UPLOAD_COMPLETE',
        channelId,
        messageId,
        path,
        result
      });
    },
    onReceiveMessage({ pageVisible, message, usingChat }) {
      return dispatch({
        type: 'RECEIVE_MESSAGE',
        usingChat,
        pageVisible,
        message: {
          ...message,
          timeStamp: Math.floor(Date.now() / 1000)
        }
      });
    },
    onReceiveFirstMsg({ data, duplicate, pageVisible }) {
      return dispatch({
        type: 'RECEIVE_FIRST_MSG',
        data,
        duplicate,
        pageVisible
      });
    },
    onReceiveMessageOnDifferentChannel({
      channel,
      senderIsNotTheUser,
      pageVisible,
      usingChat
    }) {
      return dispatch({
        type: 'RECEIVE_MSG_ON_DIFF_CHANNEL',
        channel,
        senderIsNotTheUser,
        pageVisible,
        usingChat
      });
    },
    onReloadChatSubject({ subject, message }) {
      return dispatch({
        type: 'RELOAD_SUBJECT',
        subject,
        message
      });
    },
    onResetChat() {
      return dispatch({
        type: 'RESET_CHAT'
      });
    },
    onSaveMessage({ index, messageId }) {
      return dispatch({
        type: 'ADD_ID_TO_NEW_MESSAGE',
        messageIndex: index,
        messageId
      });
    },
    onSearchChat(data) {
      return dispatch({
        type: 'SEARCH',
        data
      });
    },
    onSearchChatSubject(data) {
      return dispatch({
        type: 'SEARCH_SUBJECT',
        data
      });
    },
    onSearchUserToInvite(data) {
      return dispatch({
        type: 'SEARCH_USERS_FOR_CHANNEL',
        data
      });
    },
    onSendFirstDirectMessage({ members, message }) {
      return dispatch({
        type: 'CREATE_NEW_DM_CHANNEL',
        members,
        message
      });
    },
    onSetReplyTarget(target) {
      return dispatch({
        type: 'SET_REPLY_TARGET',
        target
      });
    },
    onSubmitMessage({ message, replyTarget }) {
      return dispatch({
        type: 'SUBMIT_MESSAGE',
        message: {
          ...message,
          timeStamp: Math.floor(Date.now() / 1000)
        },
        replyTarget
      });
    },
    onUpdateChessMoveViewTimeStamp() {
      return dispatch({
        type: 'UPDATE_CHESS_MOVE_VIEW_STAMP'
      });
    },
    onUpdateUploadProgress({ progress, channelId, path }) {
      return dispatch({
        type: 'UPDATE_UPLOAD_PROGRESS',
        progress,
        channelId,
        path
      });
    },
    onUpdateRecentChessMessage(message) {
      return dispatch({
        type: 'UPDATE_RECENT_CHESS_MESSAGE',
        message
      });
    },
    onUpdateSelectedChannelId(channelId) {
      return dispatch({
        type: 'UPDATE_SELECTED_CHANNEL_ID',
        channelId
      });
    },
    onUploadChatSubject(data) {
      return dispatch({
        type: 'NEW_SUBJECT',
        data
      });
    }
  };
}
