export default function ChatActions(dispatch) {
  return {
    onChangeChatSubject(subject) {
      return dispatch({
        type: 'CHANGE_SUBJECT',
        subject
      });
    },
    onClearChatLoadedState() {
      return dispatch({
        type: 'CLEAR_LOADED_STATE'
      });
    },
    onClearNumUnreads() {
      return dispatch({
        type: 'CLEAR_NUM_UNREADS'
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
      return {
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
      };
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
    onIncreaseNumberOfUnreadMessages() {
      return dispatch({
        type: 'INCREASE_NUM_UNREAD_MSGS'
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
    onLoadChatSubject(data) {
      return dispatch({
        type: 'LOAD_SUBJECT',
        subject: data
      });
    },
    onOpenNewChatTab({ user, recepient }) {
      return dispatch({
        type: 'OPEN_NEW_TAB',
        user,
        recepient
      });
    }
  };
}
