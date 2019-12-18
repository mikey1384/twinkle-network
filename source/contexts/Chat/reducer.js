import { initialChatState } from '.';

export default function ChatReducer(state, action) {
  switch (action.type) {
    case 'ADD_ID_TO_NEW_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message, index) => ({
          ...message,
          id: index === action.messageIndex ? action.messageId : message.id
        }))
      };
    case 'EDIT_CHANNEL_SETTINGS':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            channelName: action.channelName,
            isClosed: action.isClosed
          }
        },
        customChannelNames: {
          ...state.customChannelNames,
          [action.channelId]: action.channelName
        }
      };
    case 'CHANGE_CHANNEL_OWNER': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            creatorId: action.newOwner.id,
            numUnreads: state.selectedChannelId === action.channelId ? 0 : 1,
            lastMessage: {
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            }
          }
        },
        messages:
          state.selectedChannelId === action.channelId
            ? state.messages.concat(action.message)
            : state.messages
      };
    }
    case 'CHANGE_CHANNEL_SETTINGS': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            channelName: action.channelName,
            isClosed: action.isClosed
          }
        }
      };
    }
    case 'CHANGE_SUBJECT': {
      return {
        ...state,
        subject: action.subject
      };
    }
    case 'CHANNEL_LOADING_DONE': {
      return {
        ...state,
        channelLoading: false
      };
    }
    case 'CLEAR_CHAT_SEARCH_RESULTS':
      return {
        ...state,
        chatSearchResults: []
      };
    case 'CLEAR_NUM_UNREADS': {
      return {
        ...state,
        numUnreads: 0
      };
    }
    case 'CLEAR_RECENT_CHESS_MESSAGE': {
      return {
        ...state,
        recentChessMessage: undefined
      };
    }
    case 'CLEAR_SUBJECT_SEARCH_RESULTS':
      return {
        ...state,
        subjectSearchResults: []
      };
    case 'CLEAR_USER_SEARCH_RESULTS':
      return {
        ...state,
        userSearchResults: []
      };
    case 'CREATE_NEW_CHANNEL': {
      const { channelId } = action.data.message;
      return {
        ...state,
        replyTarget: null,
        subject: {},
        channelIds: [channelId].concat(state.channelIds),
        channelsObj: {
          ...state.channelsObj,
          [channelId]: {
            id: channelId,
            channelName: action.data.message.channelName,
            lastMessage: {
              content: action.data.message.content,
              sender: {
                id: action.data.message.userId,
                username: action.data.message.username
              }
            },
            lastUpdate: action.data.message.timeStamp,
            isClosed: action.data.isClosed,
            numUnreads: 0,
            twoPeople: false,
            creatorId: action.data.message.userId,
            members: action.data.members
          }
        },
        selectedChannelId: channelId,
        messages: [action.data.message],
        loadMoreMessages: false
      };
    }
    case 'CREATE_NEW_DM_CHANNEL':
      return {
        ...state,
        subject: {},
        channelIds: [
          action.message.channelId,
          ...state.channelIds.filter(channelId => channelId !== 0)
        ],
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
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
            numUnreads: 0,
            twoPeople: true,
            members: action.members
          }
        },
        selectedChannelId: action.message.channelId,
        messages: [{ ...action.message }]
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(
          message => message.id !== action.messageId
        )
      };
    case 'DISPLAY_ATTACHED_FILE':
      return {
        ...state,
        messages: state.messages.map(message => {
          return message.filePath === action.filePath
            ? {
                ...message,
                ...action.fileInfo,
                id: state.filesBeingUploaded[action.channelId]?.filter(
                  file => file.filePath === action.filePath
                )?.[0]?.id,
                fileToUpload: undefined
              }
            : message;
        })
      };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message => {
          return {
            ...message,
            content:
              message.id === action.data.messageId
                ? action.data.editedMessage
                : message.content
          };
        })
      };
    case 'ENTER_CHANNEL': {
      let loadMoreMessages = false;
      let originalNumUnreads = 0;
      const selectedChannel = action.data.channel;
      const uploadStatusMessages = state.filesBeingUploaded[
        selectedChannel.id
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreMessages = true;
      }
      action.data.messages.reverse();
      return {
        ...state,
        chatType: null,
        replyTarget: null,
        recentChessMessage: undefined,
        channelsObj: {
          ...state.channelsObj,
          [selectedChannel.id]: selectedChannel
        },
        channelIds: state.channelIds.reduce((prev, channelId, index) => {
          if (action.showOnTop && index === state.channelIds.length - 1) {
            return [selectedChannel.id].concat(
              prev.concat(channelId === selectedChannel.id ? [] : [channelId])
            );
          }
          if (action.showOnTop && selectedChannel.id === channelId) {
            return prev;
          }
          return prev.concat([channelId]);
        }, []),
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        messagesLoaded: true,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        selectedChannelId: selectedChannel.id,
        subject: selectedChannel.id === 2 ? state.subject : {},
        loadMoreMessages
      };
    }
    case 'ENTER_DICTIONARY':
      return {
        ...state,
        selectedChannelId: null,
        chatType: 'dictionary',
        messages: [],
        loadMoreMessages: false
      };
    case 'ENTER_EMPTY_CHAT':
      return {
        ...state,
        replyTarget: null,
        recentChessMessage: undefined,
        subject: {},
        selectedChannelId: 0,
        messages: [],
        loadMoreMessages: false
      };
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      };
    case 'HIDE_ATTACHMENT':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.messageId
            ? { ...message, attachmentHidden: true }
            : message
        )
      };
    case 'HIDE_CHAT':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            isHidden: true
          }
        }
      };
    case 'INIT_CHAT': {
      let loadMoreMessages = false;
      let originalNumUnreads = 0;
      let channelLoadMoreButton = false;
      const uploadStatusMessages = state.filesBeingUploaded[
        action.data.currentChannelId
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages && action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreMessages = true;
      }
      action.data.messages && action.data.messages.reverse();
      if (action.data.channelIds.length > 20) {
        action.data.channelIds.pop();
        channelLoadMoreButton = true;
      }
      return {
        ...initialChatState,
        chatType: action.data.chatType,
        loaded: true,
        channelIds: action.data.channelIds,
        channelsObj: {
          ...action.data.channelsObj,
          [action.data.currentChannelId]: {
            ...action.data.channelsObj[action.data.currentChannelId],
            numUnreads: 0
          }
        },
        channelLoadMoreButton,
        customChannelNames: action.data.customChannelNames,
        loadMoreMessages,
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        messagesLoaded: true,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        recentChessMessage: undefined,
        reconnecting: false,
        selectedChannelId: action.data.currentChannelId,
        subject: action.data.currentChannelId === 2 ? state.subject : {}
      };
    }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [state.selectedChannelId]: {
            ...state.channelsObj[state.selectedChannelId],
            members: state.channelsObj[state.selectedChannelId].members.concat(
              action.data.selectedUsers.map(user => ({
                id: user.id,
                username: user.username,
                profilePicId: user.profilePicId
              }))
            )
          }
        },
        messages: state.messages.concat([action.data.message])
      };
    case 'LEAVE_CHANNEL':
      return {
        ...state,
        messages: [],
        channelIds: state.channelIds.filter(
          channelId => channelId !== action.channelId
        )
      };
    case 'LOAD_MORE_CHANNELS': {
      let channelLoadMoreButton = false;
      if (action.data.length > 20) {
        action.data.pop();
        channelLoadMoreButton = true;
      }
      const channels = {};
      for (let channel of action.data) {
        channels[channel.id] = channel;
      }
      return {
        ...state,
        channelLoadMoreButton,
        channelIds: state.channelIds.concat(
          action.data.map(channel => channel.id)
        ),
        channelsObj: {
          ...state.channelsObj,
          ...channels
        }
      };
    }
    case 'LOAD_MORE_MESSAGES': {
      let loadMoreMessages = false;
      if (action.data.length === 21) {
        action.data.pop();
        loadMoreMessages = true;
      }
      action.data.reverse();
      return {
        ...state,
        loadMoreMessages,
        messages: action.data.concat(state.messages)
      };
    }
    case 'LOAD_SUBJECT':
      return {
        ...state,
        subject: action.subject
      };
    case 'NEW_SUBJECT':
      return {
        ...state,
        subject: action.data.subject,
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            ...state.channelsObj[action.data.channelId],
            lastMessage: {
              content: action.data.subject.content,
              sender: {
                id: action.data.subject.userId,
                username: action.data.subject.username
              }
            }
          }
        },
        messages: state.messages.concat([
          {
            id: action.data.subject.id,
            channelId: action.data.channelId,
            ...action.data.subject
          }
        ])
      };
    case 'NOTIFY_MEMBER_LEFT': {
      let timeStamp = Math.floor(Date.now() / 1000);
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            ...state.channelsObj[action.data.channelId],
            lastUpdate: timeStamp,
            lastMessage: {
              content: 'Left this channel',
              sender: {
                id: action.data.userId,
                username: action.data.username
              }
            },
            numUnreads: 0,
            members: state.channelsObj[action.data.channelId].members.filter(
              member => member.id !== action.data.userId
            )
          }
        },
        messages: state.messages.concat([
          {
            id: null,
            channelId: action.data.channelId,
            content: 'Left this channel',
            timeStamp: timeStamp,
            isNotification: true,
            username: action.data.username,
            userId: action.data.userId,
            profilePicId: action.data.profilePicId
          }
        ])
      };
    }
    case 'OPEN_DM': {
      let loadMoreMessages = false;
      if (action.messages.length > 20) {
        action.messages.pop();
        loadMoreMessages = true;
      }
      return {
        ...state,
        loaded: true,
        recentChessMessage: undefined,
        replyTarget: null,
        subject: {},
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            id: action.channelId,
            twoPeople: true,
            members: [action.user, action.recepient],
            channelName: action.recepient.username,
            lastMessage: action.lastMessage,
            lastUpdate: action.lastUpdate,
            numUnreads: 0
          }
        },
        channelIds: [action.channelId].concat(
          state.channelIds.filter(channelId => channelId !== action.channelId)
        ),
        selectedChannelId: action.channelId,
        messages: action.messages.reverse(),
        loadMoreMessages,
        recepientId: action.recepient.id
      };
    }
    case 'OPEN_NEW_TAB':
      return {
        ...state,
        replyTarget: null,
        recentChessMessage: undefined,
        subject: {},
        channelIds: [
          0,
          ...state.channelIds.filter(channelId => channelId !== 0)
        ],
        selectedChannelId: 0,
        channelsObj: {
          ...state.channelsObj,
          '0': {
            id: 0,
            channelName: action.recepient.username,
            lastMessage: {
              content: null,
              sender: null
            },
            lastUpdate: null,
            members: [action.user, action.recepient],
            numUnreads: 0,
            twoPeople: true
          }
        },
        messages: [],
        loadMoreMessages: false,
        recepientId: action.recepient.id
      };
    case 'POST_FILE_UPLOAD_STATUS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[
            action.channelId
          ]?.concat(action.file) || [action.file]
        }
      };
    case 'POST_UPLOAD_COMPLETE':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    id: action.messageId,
                    uploadComplete: action.result
                  }
                : file
          )
        }
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        messages: state.messages.concat([action.message]),
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            ...state.channelsObj[action.message.channelId],
            lastMessage: {
              fileName: action.message.fileName || '',
              gameWinnerId: action.message.gameWinnerId,
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            lastUpdate: action.message.timeStamp,
            numUnreads: 0,
            isHidden: false
          }
        }
      };
    case 'RECEIVE_FIRST_MSG':
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
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            id: action.data.channelId,
            members: action.data.members,
            twoPeople: true,
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
        },
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
        channelIds: [action.data.channelId].concat(
          state.channelIds.filter((channelId, index) =>
            action.duplicate ? index !== 0 : true
          )
        )
      };
    case 'RECEIVE_MSG_ON_DIFF_CHANNEL':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channel.id]: {
            ...state.channelsObj[action.channel.id],
            ...action.channel,
            numUnreads:
              Number(state.channelsObj[action.channel.id]?.numUnreads || 0) + 1
          }
        },
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        channelIds: [action.channel.id].concat(
          state.channelIds.filter(channelId => channelId !== action.channel.id)
        )
      };
    case 'RELOAD_SUBJECT':
      return {
        ...state,
        subject: action.subject,
        messages: state.messages.concat([action.message])
      };
    case 'RESET_CHAT':
      return initialChatState;
    case 'SEARCH':
      return {
        ...state,
        chatSearchResults: action.data
      };
    case 'SEARCH_SUBJECT':
      return {
        ...state,
        subjectSearchResults: action.data
      };
    case 'SEARCH_USERS_FOR_CHANNEL':
      return {
        ...state,
        userSearchResults: action.data
      };
    case 'SET_RECONNECTING': {
      return {
        ...state,
        reconnecting: true
      };
    }
    case 'SET_REPLY_TARGET': {
      return {
        ...state,
        replyTarget: action.target
      };
    }
    case 'SUBMIT_MESSAGE':
      return {
        ...state,
        channelIds: state.channelIds.reduce((prev, channelId) => {
          const next =
            channelId === action.message.channelId
              ? [channelId].concat(prev)
              : prev.concat([channelId]);
          return next;
        }, []),
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            ...state.channelsObj[action.message.channelId],
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
        },
        messages: state.messages.concat([
          {
            ...action.message,
            content: action.message.content,
            targetMessage: action.replyTarget
          }
        ])
      };
    case 'UPDATE_UPLOAD_PROGRESS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    uploadProgress: action.progress
                  }
                : file
          )
        }
      };
    case 'UPDATE_CHESS_MOVE_VIEW_STAMP':
      return {
        ...state,
        messages: state.messages.map(message =>
          !message.moveViewTimeStamp
            ? { ...message, moveViewTimeStamp: Math.floor(Date.now() / 1000) }
            : message
        )
      };
    case 'UPDATE_CLIENT_TO_API_SERVER_PROGRESS':
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
    case 'UPDATE_RECENT_CHESS_MESSAGE':
      return {
        ...state,
        recentChessMessage: action.message
      };
    case 'UPDATE_SELECTED_CHANNEL_ID':
      return {
        ...state,
        channelLoading: true,
        messages: [],
        messagesLoaded: false,
        loadMoreMessages: false,
        selectedChannelId: action.channelId
      };
    default:
      return state;
  }
}
