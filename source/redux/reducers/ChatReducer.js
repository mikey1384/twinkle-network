import CHAT from '../constants/Chat';

const defaultState = {
  loaded: false,
  selectedChannelId: null,
  currentChannel: {},
  channels: [],
  messages: [],
  userSearchResults: [],
  chatSearchResults: [],
  loadMoreMessages: false,
  channelLoadMoreButton: false,
  numUnreads: 0,
  msgsWhileInvisible: 0,
  recepientId: null,
  recentChessMessage: undefined,
  subject: {},
  subjectSearchResults: [],
  filesBeingUploaded: {}
};

export default function ChatReducer(state = defaultState, action) {
  switch (action.type) {
    case CHAT.ADD_ID_TO_NEW_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((message, index) => ({
          ...message,
          id: index === action.messageIndex ? action.messageId : message.id
        }))
      };
    case CHAT.CREATE_NEW_DM_CHANNEL:
      return {
        ...state,
        subject: {},
        channels: state.channels.map(channel => {
          if (channel.id === 0) {
            return {
              ...channel,
              id: action.message.channelId,
              lastMessage: {
                fileName: action.message.fileName || '',
                content: action.message.content,
                sender: {
                  id: action.message.userId,
                  username: action.message.username
                }
              },
              lastUpdate: action.message.timeStamp,
              members: action.members,
              numUnreads: 0
            };
          }
          return channel;
        }),
        selectedChannelId: action.message.channelId,
        currentChannel: {
          id: action.message.channelId,
          twoPeople: true,
          creatorId: action.message.userId,
          members: action.members
        },
        messages: [{ ...action.message }]
      };
    case CHAT.RECEIVE_FIRST_MSG:
      return {
        ...state,
        subject: action.duplicate ? {} : state.subject,
        numUnreads:
          action.duplicate && action.pageVisible
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        selectedChannelId: action.duplicate
          ? action.data.channelId
          : state.selectedChannelId,
        currentChannel: action.duplicate
          ? {
              id: action.data.channelId,
              members: action.data.members,
              twoPeople: true
            }
          : state.currentChannel,
        messages: action.duplicate
          ? [
              {
                id: null,
                channelId: action.data.channelId,
                content: action.data.content,
                timeStamp: action.datatimeStamp,
                username: action.data.username,
                userId: action.data.userId,
                profilePicId: action.data.profilePicId
              }
            ]
          : state.messages,
        channels: [
          {
            id: action.data.channelId,
            channelName: action.data.channelName || action.data.username,
            lastMessage: {
              fileName: action.data.fileName || '',
              content: action.data.content,
              sender: {
                id: action.data.userId,
                username: action.data.username
              }
            },
            lastUpdate: action.data.timeStamp,
            numUnreads: 1
          }
        ].concat(
          state.channels.filter((channel, index) =>
            action.duplicate ? index !== 0 : true
          )
        )
      };
    case CHAT.RELOAD_SUBJECT:
      return {
        ...state,
        subject: action.subject,
        messages: state.messages.concat([action.message])
      };
    case CHAT.SEARCH:
      return {
        ...state,
        chatSearchResults: action.data
      };
    case CHAT.SEARCH_SUBJECT:
      return {
        ...state,
        subjectSearchResults: action.data
      };
    case CHAT.SEARCH_USERS_FOR_CHANNEL:
      return {
        ...state,
        userSearchResults: action.data
      };
    case CHAT.SUBMIT_MESSAGE:
      return {
        ...state,
        channels: state.channels.reduce((result, channel) => {
          return channel.id === action.message.channelId
            ? [
                {
                  ...channel,
                  lastMessage: {
                    fileName: action.message.fileName || '',
                    gameWinnerId: action.message.gameWinnerId,
                    content: action.message.content,
                    sender: {
                      id: action.message.userId,
                      username: action.message.username
                    }
                  },
                  lastUpdate: Math.floor(Date.now() / 1000),
                  numUnreads: 0
                }
              ].concat(result)
            : result.concat([channel]);
        }, []),
        messages: state.messages.concat([
          {
            ...action.message,
            content: action.message.content
          }
        ])
      };
    case CHAT.NEW_SUBJECT:
      return {
        ...state,
        subject: action.data.subject,
        channels: state.channels.map(channel => ({
          ...channel,
          lastMessage: {
            content:
              channel.id === 2
                ? action.data.subject.content
                : channel.lastMessage.content,
            sender: {
              id: action.data.subject.userId,
              username: action.data.subject.username
            }
          }
        })),
        messages: state.messages.concat([
          {
            id: action.data.subject.id,
            channelId: 2,
            ...action.data.subject
          }
        ])
      };
    case CHAT.RESET:
      return defaultState;
    case CHAT.UPDATE_API_SERVER_TO_S3_PROGRESS:
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    apiServerToS3Progress: action.progress
                  }
                : file
          )
        }
      };
    case CHAT.UPDATE_CLIENT_TO_API_SERVER_PROGRESS:
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    clientToApiServerProgress: action.progress
                  }
                : file
          )
        }
      };
    case CHAT.UPDATE_CHESS_MOVE_VIEW_STAMP:
      return {
        ...state,
        messages: state.messages.map(message =>
          !message.moveViewTimeStamp
            ? { ...message, moveViewTimeStamp: Math.floor(Date.now() / 1000) }
            : message
        )
      };
    case CHAT.UPDATE_RECENT_CHESS_MESSAGE:
      return {
        ...state,
        recentChessMessage: action.message
      };
    case CHAT.UPDATE_SELECTED_CHANNEL_ID:
      return {
        ...state,
        subject: action.channelId === 2 ? state.subject : {},
        selectedChannelId: action.channelId
      };
    default:
      return state;
  }
}
