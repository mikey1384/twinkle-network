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
    case 'APPLY_CHANGED_CHANNEL_TITLE':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          title:
            state.currentChannel.id === action.data.channelId
              ? action.data.title
              : state.currentChannel.title
        },
        channels: state.channels.map(channel => {
          return {
            ...channel,
            channelName:
              channel.id === action.data.channelId
                ? action.data.title
                : channel.channelName
          };
        })
      };
    case 'CHANGE_SUBJECT': {
      return {
        ...state,
        subject: action.subject
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
        numUnreads: 0,
        channels: state.channels.map(channel =>
          channel.id === action.channelId
            ? {
                ...channel,
                numUnreads: 0
              }
            : channel
        )
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
    case 'CREATE_NEW_CHANNEL':
      return {
        ...state,
        subject: {},
        channels: [
          {
            id: action.data.message.channelId,
            channelName: action.data.message.channelName,
            lastMessage: {
              content: action.data.message.content,
              sender: {
                id: action.data.message.userId,
                username: action.data.message.username
              }
            },
            lastUpdate: action.data.message.timeStamp,
            numUnreads: 0
          }
        ].concat(state.channels),
        selectedChannelId: action.data.message.channelId,
        currentChannel: {
          id: action.data.message.channelId,
          twoPeople: false,
          creatorId: action.data.message.userId,
          members: action.data.members
        },
        messages: [action.data.message],
        loadMoreMessages: false
      };
    case 'CREATE_NEW_DM_CHANNEL':
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
        recentChessMessage: undefined,
        currentChannel: selectedChannel,
        channels: state.channels.reduce((prev, channel, index) => {
          if (channel.id === selectedChannel.id) {
            originalNumUnreads = channel.numUnreads;
          }
          if (action.showOnTop && index === state.channels.length - 1) {
            return [selectedChannel].concat(
              prev.concat(channel.id === selectedChannel.id ? [] : [channel])
            );
          }
          if (action.showOnTop && selectedChannel.id === channel.id) {
            return prev;
          }
          return prev.concat([
            {
              ...channel,
              numUnreads:
                channel.id === selectedChannel.id ? 0 : channel.numUnreads
            }
          ]);
        }, []),
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        selectedChannelId: selectedChannel.id,
        subject: action.channelId === 2 ? state.subject : {},
        loadMoreMessages
      };
    }
    case 'ENTER_EMPTY_CHAT':
      return {
        ...state,
        recentChessMessage: undefined,
        subject: {},
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: state.channels[0].members
        },
        messages: [],
        loadMoreMessages: false
      };
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      };
    case 'HIDE_CHAT':
      return {
        ...state,
        channels: state.channels.map(channel => {
          return {
            ...channel,
            isHidden: channel.id === action.channelId
          };
        })
      };
    case 'INIT_CHAT': {
      let loadMoreMessages = false;
      let originalNumUnreads = 0;
      let channelLoadMoreButton = false;
      const uploadStatusMessages = state.filesBeingUploaded[
        action.data.currentChannel.id
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages && action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreMessages = true;
      }
      action.data.messages && action.data.messages.reverse();
      if (action.data.channels.length > 20) {
        action.data.channels.pop();
        channelLoadMoreButton = true;
      }
      return {
        ...initialChatState,
        loaded: true,
        channelLoadMoreButton,
        recentChessMessage: undefined,
        subject: action.data.currentChannel.id === 2 ? state.subject : {},
        currentChannel: action.data.currentChannel,
        selectedChannelId: action.data.currentChannel.id,
        channels: action.data.channels,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        loadMoreMessages,
        reconnecting: false
      };
    }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.concat(
            action.data.selectedUsers.map(user => ({
              userId: user.id,
              username: user.username
            }))
          )
        },
        messages: state.messages.concat([action.data.message])
      };
    case 'LEAVE_CHANNEL':
      return {
        ...state,
        channels: state.channels.filter(
          channel => channel.id !== action.channelId
        )
      };
    case 'LOAD_MORE_CHANNELS': {
      let channelLoadMoreButton = false;
      if (action.data.length > 20) {
        action.data.pop();
        channelLoadMoreButton = true;
      }
      return {
        ...state,
        channelLoadMoreButton,
        channels: state.channels.concat(action.data)
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
    case 'NOTIFY_MEMBER_LEFT':
      let timeStamp = Math.floor(Date.now() / 1000);
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.data.channelId
            ? {
                ...channel,
                lastUpdate: timeStamp,
                lastMessage: {
                  content: 'Left the channel',
                  sender: {
                    id: action.data.userId,
                    username: action.data.username
                  }
                },
                numUnreads: 0
              }
            : channel
        ),
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.filter(
            member => member.userId !== action.data.userId
          )
        },
        messages: state.messages.concat([
          {
            id: null,
            channelId: action.data.channelId,
            content: 'Left the channel',
            timeStamp: timeStamp,
            isNotification: true,
            username: action.data.username,
            userId: action.data.userId,
            profilePicId: action.data.profilePicId
          }
        ])
      };
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
        subject: {},
        channels: [
          {
            id: action.channelId,
            channelName: action.recepient.username,
            lastMessage: action.lastMessage,
            lastUpdate: action.lastUpdate,
            members: [action.user, action.recepient],
            numUnreads: 0
          }
        ].concat(
          state.channels.filter(channel => channel.id !== action.channelId)
        ),
        selectedChannelId: action.channelId,
        currentChannel: {
          id: action.channelId,
          twoPeople: true,
          members: [action.user, action.recepient]
        },
        messages: action.messages.reverse(),
        loadMoreMessages,
        recepientId: action.recepient.id
      };
    }
    case 'OPEN_NEW_TAB':
      return {
        ...state,
        recentChessMessage: undefined,
        subject: {},
        channels: [
          {
            id: 0,
            channelName: action.recepient.username,
            lastMessage: {
              content: null,
              sender: null
            },
            lastUpdate: null,
            members: [action.user, action.recepient],
            numUnreads: 0
          }
        ].concat(state.channels.filter(channel => channel.id !== 0)),
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: [action.user, action.recepient]
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
        channels: state.channels.map(channel => {
          if (channel.id === action.message.channelId) {
            return {
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
              lastUpdate: action.message.timeStamp,
              numUnreads: 0,
              isHidden: false
            };
          }
          return channel;
        })
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
    case 'RECEIVE_MSG_ON_DIFF_CHANNEL':
      for (let i = 0; i < state.channels.length; i++) {
        if (state.channels[i].id === action.channel.id) {
          action.channel.numUnreads = state.channels[i].numUnreads + 1;
        }
      }
      return {
        ...state,
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        channels: [action.channel].concat(
          state.channels.filter(channel => channel.id !== action.channel.id)
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
    case 'SUBMIT_MESSAGE':
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
    case 'UPDATE_API_SERVER_TO_S3_PROGRESS':
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
        selectedChannelId: action.channelId
      };
    default:
      return state;
  }
}
