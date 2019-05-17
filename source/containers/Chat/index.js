import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as ChatActions from 'redux/actions/ChatActions';
import ChatInput from './ChatInput';
import CreateNewChannelModal from './Modals/CreateNewChannel';
import InviteUsersModal from './Modals/InviteUsers';
import EditTitleModal from './Modals/EditTitle';
import ConfirmModal from 'components/Modals/ConfirmModal';
import UserListModal from 'components/Modals/UserListModal';
import DropdownButton from 'components/Buttons/DropdownButton';
import LeftMenu from './LeftMenu';
import MessagesContainer from './MessagesContainer';
import Loading from 'components/Loading';
import ChessModal from './Modals/ChessModal';
import { GENERAL_CHAT_ID } from 'constants/database';
import { mobileMaxWidth, Color } from 'constants/css';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { connect } from 'react-redux';

Chat.propTypes = {
  channelLoadMoreButtonShown: PropTypes.bool,
  channels: PropTypes.array.isRequired,
  createNewChannel: PropTypes.func,
  currentChannel: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editChannelTitle: PropTypes.func,
  enterChannelWithId: PropTypes.func,
  enterEmptyChat: PropTypes.func,
  hideChat: PropTypes.func,
  leaveChannel: PropTypes.func,
  loadMoreButton: PropTypes.bool,
  loadMoreChannels: PropTypes.func.isRequired,
  loadMoreMessages: PropTypes.func,
  messages: PropTypes.array,
  notifyThatMemberLeftChannel: PropTypes.func,
  onUnmount: PropTypes.func.isRequired,
  openDirectMessageChannel: PropTypes.func,
  pageVisible: PropTypes.bool,
  profilePicId: PropTypes.number,
  partnerId: PropTypes.number,
  receiveMessage: PropTypes.func,
  receiveMessageOnDifferentChannel: PropTypes.func,
  receiveFirstMsg: PropTypes.func,
  selectedChannelId: PropTypes.number,
  sendFirstDirectMessage: PropTypes.func,
  socketConnected: PropTypes.bool,
  submitMessage: PropTypes.func,
  subjectId: PropTypes.number,
  updateChessMoveViewTimeStamp: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string
};

function Chat({
  channels,
  channelLoadMoreButtonShown,
  currentChannel,
  createNewChannel,
  dispatch,
  editChannelTitle,
  enterChannelWithId,
  enterEmptyChat,
  hideChat,
  leaveChannel,
  loadMoreButton,
  loadMoreChannels,
  loadMoreMessages,
  messages,
  notifyThatMemberLeftChannel,
  onUnmount,
  openDirectMessageChannel,
  pageVisible,
  partnerId,
  profilePicId,
  receiveFirstMsg,
  receiveMessage,
  receiveMessageOnDifferentChannel,
  selectedChannelId,
  sendFirstDirectMessage,
  socketConnected,
  subjectId,
  submitMessage,
  updateChessMoveViewTimeStamp,
  userId,
  username
}) {
  const [channelsObj, setChannelsObj] = useState({});
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [
    currentChannelOnlineMembers,
    setCurrentChannelOnlineMembers
  ] = useState([]);
  const [leaveConfirmModalShown, setLeaveConfirmModalShown] = useState(false);
  const [createNewChannelModalShown, setCreateNewChannelModalShown] = useState(
    false
  );
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [editTitleModalShown, setEditTitleModalShown] = useState(false);
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [chessModalShown, setChessModalShown] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setChannelsObj(
      channels.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.id]: curr
        }),
        {}
      )
    );
    return () => {
      mounted.current = false;
      onUnmount();
    };
  }, []);

  useEffect(() => {
    socket.on('receive_message', onReceiveMessage);
    socket.on('subject_change', onSubjectChange);
    socket.on('chat_invitation', onChatInvitation);
    socket.on('change_in_members_online', onChangeMembersOnline);
    socket.on('notifiy_move_viewed', updateChessMoveViewTimeStamp);

    function onReceiveMessage(message, channel) {
      let messageIsForCurrentChannel = message.channelId === currentChannel.id;
      let senderIsNotTheUser = message.userId !== userId;
      if (messageIsForCurrentChannel && senderIsNotTheUser) {
        receiveMessage({ message, pageVisible });
      }
      if (!messageIsForCurrentChannel) {
        receiveMessageOnDifferentChannel({
          message,
          channel,
          senderIsNotTheUser
        });
      }
    }

    function onChangeMembersOnline(data) {
      let forCurrentChannel = data.channelId === currentChannel.id;
      if (forCurrentChannel) {
        if (data.leftChannel) {
          const { userId, username, profilePicId } = data.leftChannel;
          notifyThatMemberLeftChannel({
            channelId: data.channelId,
            userId,
            username,
            profilePicId
          });
        }
        setCurrentChannelOnlineMembers(data.membersOnline);
      }
    }

    return function cleanUp() {
      socket.removeListener(
        'notifiy_move_viewed',
        updateChessMoveViewTimeStamp
      );
      socket.removeListener('receive_message', onReceiveMessage);
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('subject_change', onSubjectChange);
      socket.removeListener('change_in_members_online', onChangeMembersOnline);
    };
  });

  useEffect(() => {
    setLoading(true);
    socket.emit('check_online_members', selectedChannelId, (err, data) => {
      if (err) console.error(err);
      if (mounted.current) {
        setCurrentChannelOnlineMembers(data.membersOnline);
      }
    });
  }, [selectedChannelId]);

  let menuProps = currentChannel.twoPeople
    ? [{ label: 'Hide Chat', onClick: onHideChat }]
    : [
        {
          label: 'Invite People',
          onClick: () => setInviteUsersModalShown(true)
        },
        {
          label: 'Edit Channel Name',
          onClick: () => setEditTitleModalShown(true)
        },
        {
          separator: true
        },
        {
          label: 'Leave Channel',
          onClick: () => setLeaveConfirmModalShown(true)
        }
      ];

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        display: flex;
        font-size: 1.5rem;
        position: relative;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100vw;
          height: CALC(100% - 1rem);
        }
      `}
    >
      {leaveConfirmModalShown && (
        <ConfirmModal
          title="Leave Channel"
          onHide={() => setLeaveConfirmModalShown(false)}
          onConfirm={onLeaveChannel}
        />
      )}
      {createNewChannelModalShown && (
        <CreateNewChannelModal
          userId={userId}
          onHide={() => setCreateNewChannelModalShown(false)}
          onDone={onCreateNewChannel}
        />
      )}
      {inviteUsersModalShown && (
        <InviteUsersModal
          onHide={() => setInviteUsersModalShown(false)}
          currentChannel={currentChannel}
          onDone={onInviteUsersDone}
        />
      )}
      {editTitleModalShown && (
        <EditTitleModal
          title={channelName(currentChannel)}
          onHide={() => setEditTitleModalShown(false)}
          onDone={onEditTitleDone}
        />
      )}
      {userListModalShown && (
        <UserListModal
          onHide={() => setUserListModalShown(false)}
          users={returnUsers(currentChannel, currentChannelOnlineMembers)}
          descriptionShown={userListDescriptionShown}
          description="(online)"
          title="Online Status"
        />
      )}
      <LeftMenu
        channels={channels}
        channelLoadMoreButtonShown={channelLoadMoreButtonShown}
        currentChannel={currentChannel}
        currentChannelOnlineMembers={currentChannelOnlineMembers}
        loadMoreChannels={loadMoreChannels}
        onChannelEnter={onChannelEnter}
        onNewButtonClick={onNewButtonClick}
        selectedChannelId={selectedChannelId}
        showUserListModal={() => setUserListModalShown(true)}
        userId={userId}
      />
      <div
        className={css`
          height: 100%;
          width: CALC(100% - 30rem);
          border-left: 1px solid ${Color.borderGray()};
          padding: 0 0 1rem 1rem;
          position: relative;
          background: #fff;
          @media (max-width: ${mobileMaxWidth}) {
            width: 75%;
          }
        `}
      >
        {currentChannel.id !== GENERAL_CHAT_ID && (
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            opacity={0.7}
            style={{
              position: 'absolute',
              zIndex: 10,
              top: '1rem',
              right: '1rem'
            }}
            direction="left"
            icon="bars"
            text="Menu"
            menuProps={menuProps}
          />
        )}
        <MessagesContainer
          channelId={currentChannel.id}
          channelName={channelName(currentChannel)}
          className={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: CALC(
              100% - ${textAreaHeight ? `${textAreaHeight}px` : '4.5rem'}
            );
            position: relative;
            -webkit-overflow-scrolling: touch;
          `}
          loading={loading}
          currentChannelId={currentChannel.id}
          loadMoreButton={loadMoreButton}
          messages={messages}
          userId={userId}
          loadMoreMessages={loadMoreMessages}
          onChessBoardClick={() => setChessModalShown(true)}
          onChessSpoilerClick={handleChessSpoilerClick}
          onLoadingDone={() => setLoading(false)}
        />
        {socketConnected ? (
          <ChatInput
            onChange={setChatMessage}
            message={chatMessage}
            myId={userId}
            channelMembers={currentChannel.members}
            isTwoPeopleChannel={currentChannel.twoPeople}
            currentChannelId={currentChannel.id}
            onChessButtonClick={() => setChessModalShown(true)}
            onMessageSubmit={onMessageSubmit}
            onHeightChange={height => {
              if (height !== textAreaHeight) {
                setTextAreaHeight(height > 46 ? height : 0);
              }
            }}
          />
        ) : (
          <div>
            <Loading
              style={{ height: '2.2rem' }}
              innerStyle={{ fontSize: '2rem' }}
              text="Socket disconnected. Reconnecting..."
            />
          </div>
        )}
      </div>
      {chessModalShown && (
        <ChessModal
          channelId={currentChannel.id}
          myId={userId}
          onConfirmChessMove={handleConfirmChessMove}
          onHide={() => setChessModalShown(false)}
          {...getOpponentInfo()}
        />
      )}
    </div>
  );

  function channelName(currentChannel) {
    return channelsObj[currentChannel.id]?.channelName;
  }

  function getOpponentInfo() {
    let opponentId;
    let opponentName;
    if (currentChannel?.members) {
      for (let i = 0; i < currentChannel.members.length; i++) {
        const member = currentChannel.members[i];
        if (member.id !== userId) {
          opponentId = member.id;
          opponentName = member.username;
          break;
        }
      }
    }
    return { opponentId, opponentName };
  }

  async function handleChessSpoilerClick() {
    setChessModalShown(true);
    return Promise.resolve();
  }

  function userListDescriptionShown(user) {
    for (let i = 0; i < currentChannelOnlineMembers.length; i++) {
      if (user.id === currentChannelOnlineMembers[i].id) return true;
    }
    return false;
  }

  function returnUsers({ members: allMembers }, currentChannelOnlineMembers) {
    return allMembers.length > 0 ? allMembers : currentChannelOnlineMembers;
  }

  async function onMessageSubmit(message) {
    setTextAreaHeight(0);
    let isFirstDirectMessage = currentChannel.id === 0;
    if (isFirstDirectMessage) {
      return sendFirstDirectMessage({ message, userId, partnerId }).then(
        chat => {
          socket.emit('join_chat_channel', chat.channelId);
          socket.emit('send_bi_chat_invitation', partnerId, chat);
        }
      );
    }
    const params = {
      userId,
      username,
      profilePicId,
      content: message,
      channelId: currentChannel.id,
      subjectId
    };
    let channel = channels
      .filter(channel => channel.id === currentChannel.id)
      .map(channel => ({
        ...channel,
        channelName: currentChannel.twoPeople ? username : channel.channelName,
        lastMessage: message,
        lastMessageSender: {
          id: userId,
          username
        },
        numUnreads: 1
      }));
    try {
      submitMessage(params);
      socket.emit('new_chat_message', params, channel);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleConfirmChessMove(state) {
    const params = {
      userId,
      username,
      profilePicId,
      content: 'Made a chess move',
      channelId: currentChannel.id,
      chessState: state,
      isChessMove: 1
    };
    try {
      submitMessage(params);
      socket.emit('new_chat_message', params, currentChannel);
    } catch (error) {
      console.error(error);
    }
  }

  function onNewButtonClick() {
    setCreateNewChannelModalShown(true);
  }

  function onChannelEnter(id) {
    if (id === 0) {
      setCurrentChannelOnlineMembers([]);
      return enterEmptyChat();
    }
    enterChannelWithId({ channelId: id });
  }

  async function onCreateNewChannel(params) {
    if (params.selectedUsers.length === 1) {
      const partner = params.selectedUsers[0];
      await openDirectMessageChannel({
        user: { username, id: userId },
        partner,
        chatCurrentlyOn: true
      });
      return setCreateNewChannelModalShown(false);
    }

    const data = await createNewChannel(params);
    const users = params.selectedUsers.map(user => user.id);
    socket.emit('join_chat_channel', data.message.channelId);
    socket.emit('send_group_chat_invitation', users, data);
    setCreateNewChannelModalShown(false);
  }

  function onSubjectChange({ message }) {
    let messageIsForCurrentChannel = message.channelId === currentChannel.id;
    let senderIsNotTheUser = message.userId !== userId;
    if (messageIsForCurrentChannel && senderIsNotTheUser) {
      receiveMessage({ message, pageVisible });
    }
    if (!messageIsForCurrentChannel) {
      receiveMessageOnDifferentChannel({
        message,
        senderIsNotTheUser,
        channel: [
          {
            id: 2,
            lastUpdate: message.timeStamp,
            isHidden: false,
            channelName: 'General',
            lastMessage: message.content,
            lastMessageSender: {
              id: message.userId,
              username: message.username
            },
            numUnreads: 1
          }
        ]
      });
    }
  }

  function onChatInvitation(data) {
    let duplicate = false;
    if (currentChannel.id === 0) {
      if (
        data.members.filter(member => member.userId !== userId)[0].userId ===
        currentChannel.members.filter(member => member.userId !== userId)[0]
          .userId
      ) {
        duplicate = true;
      }
    }
    receiveFirstMsg({ data, duplicate, pageVisible });
    socket.emit('join_chat_channel', data.channelId);
  }

  function onInviteUsersDone(users, message) {
    socket.emit('new_chat_message', {
      ...message,
      channelId: message.channelId
    });
    socket.emit('send_group_chat_invitation', users, {
      message: { ...message, messageId: message.id }
    });
    setInviteUsersModalShown(false);
  }

  async function onEditTitleDone(title) {
    await editChannelTitle({ title, channelId: currentChannel.id });
    setEditTitleModalShown(false);
  }

  function onHideChat() {
    hideChat(currentChannel.id);
  }

  function onLeaveChannel() {
    leaveChannel(currentChannel.id);
    socket.emit('leave_chat_channel', {
      channelId: currentChannel.id,
      userId,
      username,
      profilePicId
    });
    setLeaveConfirmModalShown(false);
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    pageVisible: state.ViewReducer.pageVisible,
    profilePicId: state.UserReducer.profilePicId,
    currentChannel: state.ChatReducer.currentChannel,
    selectedChannelId: state.ChatReducer.selectedChannelId,
    channels: state.ChatReducer.channels,
    messages: state.ChatReducer.messages,
    channelLoadMoreButtonShown: state.ChatReducer.channelLoadMoreButton,
    loadMoreButton: state.ChatReducer.loadMoreMessages,
    partnerId: state.ChatReducer.partnerId,
    socketConnected: state.NotiReducer.socketConnected,
    subjectId: state.ChatReducer.subject.id
  }),
  dispatch => ({
    dispatch,
    receiveMessage: params => dispatch(ChatActions.receiveMessage(params)),
    receiveMessageOnDifferentChannel: params =>
      dispatch(ChatActions.receiveMessageOnDifferentChannel(params)),
    receiveFirstMsg: params => dispatch(ChatActions.receiveFirstMsg(params)),
    enterChannelWithId: params =>
      dispatch(ChatActions.enterChannelWithId(params)),
    enterEmptyChat: params => dispatch(ChatActions.enterEmptyChat(params)),
    submitMessage: params => dispatch(ChatActions.submitMessageAsync(params)),
    loadMoreChannels: params => dispatch(ChatActions.loadMoreChannels(params)),
    loadMoreMessages: params => dispatch(ChatActions.loadMoreMessages(params)),
    createNewChannel: params => dispatch(ChatActions.createNewChannel(params)),
    sendFirstDirectMessage: params =>
      dispatch(ChatActions.sendFirstDirectMessage(params)),
    hideChat: params => dispatch(ChatActions.hideChat(params)),
    leaveChannel: params => dispatch(ChatActions.leaveChannel(params)),
    editChannelTitle: params => dispatch(ChatActions.editChannelTitle(params)),
    notifyThatMemberLeftChannel: params =>
      dispatch(ChatActions.notifyThatMemberLeftChannel(params)),
    openDirectMessageChannel: params =>
      dispatch(ChatActions.openDirectMessageChannel(params)),
    updateChessMoveViewTimeStamp: params =>
      dispatch(ChatActions.updateChessMoveViewTimeStamp(params))
  })
)(Chat);
