import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ChatActions from './actions';
import ChatReducer from './reducer';

export const ChatContext = createContext();

export const initialChatState = {
  channelLoadMoreButton: false,
  channelIds: [],
  channelsObj: {},
  channelOnCall: null,
  chatSearchResults: [],
  chatType: null,
  chessModalShown: false,
  creatingNewDMChannel: false,
  currentChannelName: '',
  customChannelNames: {},
  filesBeingUploaded: {},
  loadingVocabulary: false,
  loaded: false,
  messages: [],
  messagesLoadMoreButton: false,
  msgsWhileInvisible: 0,
  numUnreads: 0,
  recentChessMessage: undefined,
  recepientId: null,
  replyTarget: null,
  channelLoading: true,
  selectedChannelId: null,
  subject: {},
  subjectSearchResults: [],
  vocabErrorMessage: '',
  wordCollectors: {},
  wordRegisterStatus: undefined,
  wordsObj: {},
  userSearchResults: [],
  vocabActivities: [],
  vocabActivitiesLoadMoreButton: false
};

ChatContextProvider.propTypes = {
  children: PropTypes.node
};

export function ChatContextProvider({ children }) {
  const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);
  return (
    <ChatContext.Provider
      value={{
        state: chatState,
        actions: ChatActions(chatDispatch)
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
