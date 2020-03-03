export default function ChatActions(dispatch) {
  return {
    onCall({ channelId, callerId }) {
      return dispatch({
        type: 'INIT_CALL',
        channelId,
        callerId
      });
    },
    onCallReceptionConfirm({ channelId, peerId }) {
      console.log('yeah');
      return dispatch({
        type: 'CONFIRM_CALL_RECEPTION',
        channelId,
        peerId
      });
    },
    onChangeChannelOwner({ channelId, message, newOwner }) {
      return dispatch({
        type: 'CHANGE_CHANNEL_OWNER',
        channelId,
        message,
        newOwner
      });
    },
    onChangeChannelSettings({ channelId, channelName, isClosed }) {
      return dispatch({
        type: 'CHANGE_CHANNEL_SETTINGS',
        channelId,
        channelName,
        isClosed
      });
    },
    onChangeChatSubject(subject) {
      return dispatch({
        type: 'CHANGE_SUBJECT',
        subject
      });
    },
    onChannelLoadingDone() {
      return dispatch({
        type: 'CHANNEL_LOADING_DONE'
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
    onEditChannelSettings({ channelName, isClosed, channelId }) {
      return dispatch({
        type: 'EDIT_CHANNEL_SETTINGS',
        channelName,
        isClosed,
        channelId
      });
    },
    onEditMessage({ editedMessage, messageId }) {
      return dispatch({
        type: 'EDIT_MESSAGE',
        data: { editedMessage, messageId }
      });
    },
    onEditWord({ deletedDefIds, partOfSpeeches, editedDefinitionOrder, word }) {
      return dispatch({
        type: 'EDIT_WORD',
        deletedDefIds,
        partOfSpeeches,
        editedDefinitionOrder,
        word
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
    onHideAttachment(messageId) {
      return dispatch({
        type: 'HIDE_ATTACHMENT',
        messageId
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
    onLoadVocabulary({ vocabActivities, wordsObj, wordCollectors }) {
      return dispatch({
        type: 'LOAD_VOCABULARY',
        vocabActivities,
        wordsObj,
        wordCollectors
      });
    },
    onLoadMoreVocabulary({ vocabActivities, wordsObj }) {
      return dispatch({
        type: 'LOAD_MORE_VOCABULARY',
        vocabActivities,
        wordsObj
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
    onReceiveVocabActivity({ activity, usingVocabSection }) {
      return dispatch({
        type: 'RECEIVE_VOCAB_ACTIVITY',
        activity,
        usingVocabSection
      });
    },
    onRegisterWord(word) {
      return dispatch({
        type: 'REGISTER_WORD',
        word
      });
    },
    onReloadChatSubject({ subject, message }) {
      return dispatch({
        type: 'RELOAD_SUBJECT',
        subject,
        message
      });
    },
    onRemoveNewActivityStatus(word) {
      return dispatch({
        type: 'REMOVE_NEW_ACTIVITY_STATUS',
        word
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
    onSetChessModalShown(shown) {
      return dispatch({
        type: 'SET_CHESS_MODAL_SHOWN',
        shown
      });
    },
    onSetCreatingNewDMChannel(creating) {
      return dispatch({
        type: 'SET_CREATING_NEW_DM_CHANNEL',
        creating
      });
    },
    onSetCurrentChannelName(channelName) {
      return dispatch({
        type: 'SET_CURRENT_CHANNEL_NAME',
        channelName
      });
    },
    onSetCurrentPeerId(peerId) {
      return dispatch({
        type: 'SET_CURRENT_PEER_ID',
        peerId
      });
    },
    onSetLoadingVocabulary(loading) {
      return dispatch({
        type: 'SET_LOADING_VOCABULARY',
        loading
      });
    },
    onSetMyStream(stream) {
      return dispatch({
        type: 'SET_MY_STREAM',
        stream
      });
    },
    onSetPeerStream(stream) {
      return dispatch({
        type: 'SET_PEER_STREAM',
        stream
      });
    },
    onSetReconnecting() {
      return dispatch({
        type: 'SET_RECONNECTING'
      });
    },
    onSetReplyTarget(target) {
      return dispatch({
        type: 'SET_REPLY_TARGET',
        target
      });
    },
    onSetVocabErrorMessage(message) {
      return dispatch({
        type: 'SET_VOCAB_ERROR_MESSAGE',
        message
      });
    },
    onSetWordsObj(wordObj) {
      return dispatch({
        type: 'SET_WORDS_OBJECT',
        wordObj
      });
    },
    onSetWordRegisterStatus(status) {
      return dispatch({
        type: 'SET_WORD_REGISTER_STATUS',
        status
      });
    },
    onShowIncoming() {
      return dispatch({
        type: 'SHOW_INCOMING'
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
    onUpdateCollectorsRankings(data) {
      return dispatch({
        type: 'UPDATE_COLLECTORS_RANKINGS',
        data
      });
    },
    onUpdateChatUploadProgress({ progress, channelId, path }) {
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
