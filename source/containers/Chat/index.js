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
import AlertModal from 'components/Modals/AlertModal';
import UploadModal from './Modals/UploadModal';
import Context from './Context';
import { loadChatChannel, startNewDMChannel } from 'helpers/requestHelpers';
import { GENERAL_CHAT_ID } from 'constants/database';
import { mobileMaxWidth, Color } from 'constants/css';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { objectify } from 'helpers';

Chat.propTypes = {
  authLevel: PropTypes.number,
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
  onFileUpload: PropTypes.func,
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
  updateSelectedChannelId: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string
};

function Chat({
  authLevel,
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
  onFileUpload,
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
  updateSelectedChannelId,
  userId,
  username
}) {
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
  const [uploadModalShown, setUploadModalShown] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [chessCountdownObj, setChessCountdownObj] = useState({});
  const [channelName, setChannelName] = useState('');
  const [fileObj, setFileObj] = useState('');
  const memberObj = useRef({});
  const channelsObj = useRef({});
  const FileInputRef = useRef(null);
  const mounted = useRef(true);
  const mb = 1000;
  const maxSize =
    authLevel > 8
      ? 4000 * mb
      : authLevel > 4
      ? 2000 * mb
      : authLevel === 4
      ? 1000 * mb
      : 50 * mb;

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
      onUnmount();
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      memberObj.current = objectify(currentChannelOnlineMembers);
      channelsObj.current = objectify(channels);
    }
  }, [currentChannelOnlineMembers, channels]);

  useEffect(() => {
    const otherMember = currentChannel.twoPeople
      ? currentChannel?.members?.filter(
          member => Number(member.id) !== userId
        )?.[0]
      : null;

    setChannelName(
      otherMember?.username ||
        channelsObj.current?.[currentChannel?.id]?.channelName
    );
  }, [currentChannel]);

  useEffect(() => {
    socket.on('receive_message', onReceiveMessage);
    socket.on('subject_change', onSubjectChange);
    socket.on('chat_invitation', onChatInvitation);
    socket.on('change_in_members_online', onChangeMembersOnline);
    socket.on('notifiy_move_viewed', onNotifyMoveViewed);
    socket.on('notifiy_making_move', onNotifiedMakingMove);
    socket.on('notifiy_move_made', onNotifiedMoveMade);
    socket.on('receive_chess_countdown_number', onReceiveCountdownNumber);

    function onNotifyMoveViewed(channelId) {
      if (channelId === selectedChannelId) {
        updateChessMoveViewTimeStamp();
      }
    }

    function onReceiveMessage(message, channel) {
      let messageIsForCurrentChannel = message.channelId === selectedChannelId;
      let senderIsNotTheUser = message.userId !== userId;
      if (message.isChessMsg) {
        setChessCountdownObj(countdownObj => ({
          ...countdownObj,
          [message.channelId]: undefined
        }));
      }
      if (messageIsForCurrentChannel && senderIsNotTheUser) {
        receiveMessage({ message, pageVisible });
      }
      if (!messageIsForCurrentChannel) {
        receiveMessageOnDifferentChannel({
          channel,
          senderIsNotTheUser
        });
      }
      if (message.gameWinnerId) {
        setCurrentChannelOnlineMembers(members =>
          members.map(member => ({
            ...member,
            channelObj: {
              ...member.channelObj,
              [message.channelId]: {
                ...member.channelObj[message.channelId],
                makingChessMove: false
              }
            }
          }))
        );
      }
    }

    function onChangeMembersOnline(data) {
      let forCurrentChannel = data.channelId === selectedChannelId;
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

    function onNotifiedMakingMove({ userId, channelId }) {
      setCurrentChannelOnlineMembers(members =>
        members.map(member =>
          member.id === userId
            ? {
                ...member,
                channelObj: {
                  ...member.channelObj,
                  [channelId]: {
                    ...member.channelObj[channelId],
                    makingChessMove: true
                  }
                }
              }
            : member
        )
      );
    }

    function onNotifiedMoveMade({ userId, channelId }) {
      if (channelId === selectedChannelId) {
        setChessModalShown(false);
      }
      setCurrentChannelOnlineMembers(members =>
        members.map(member =>
          member.id === userId
            ? {
                ...member,
                channelObj: {
                  ...member.channelObj,
                  [channelId]: {
                    ...member.channelObj[channelId],
                    makingChessMove: false
                  }
                }
              }
            : member
        )
      );
    }

    function onReceiveCountdownNumber({ channelId, number }) {
      if (channelId === selectedChannelId) {
        if (number === 0) {
          setChessModalShown(false);
        }
        setChessCountdownObj(countdownObj => ({
          ...countdownObj,
          [channelId]: number
        }));
      }
    }

    return function cleanUp() {
      socket.removeListener('receive_message', onReceiveMessage);
      socket.removeListener('chat_invitation', onChatInvitation);
      socket.removeListener('subject_change', onSubjectChange);
      socket.removeListener('change_in_members_online', onChangeMembersOnline);
      socket.removeListener('notifiy_move_viewed', onNotifyMoveViewed);
      socket.removeListener('notifiy_making_move', onNotifiedMakingMove);
      socket.removeListener('notifiy_move_made', onNotifiedMoveMade);
      socket.removeListener(
        'receive_chess_countdown_number',
        onReceiveCountdownNumber
      );
    };
  });

  useEffect(() => {
    setLoading(selectedChannelId !== currentChannel.id);
    socket.emit('check_online_members', selectedChannelId, (err, data) => {
      if (err) console.error(err);
      if (mounted.current) {
        setCurrentChannelOnlineMembers(data.membersOnline);
      }
    });
  }, [currentChannel, selectedChannelId]);

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
    <Context.Provider
      value={{
        onFileUpload
      }}
    >
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
        <input
          ref={FileInputRef}
          style={{ display: 'none' }}
          type="file"
          onChange={handleUpload}
        />
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
            selectedChannelId={selectedChannelId}
            onDone={onInviteUsersDone}
          />
        )}
        {editTitleModalShown && (
          <EditTitleModal
            title={channelName}
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
          {selectedChannelId !== GENERAL_CHAT_ID && (
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
            channelId={selectedChannelId}
            channelName={channelName}
            chessCountdownObj={chessCountdownObj}
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
            currentChannelId={selectedChannelId}
            loadMoreButton={loadMoreButton}
            messages={messages}
            userId={userId}
            loadMoreMessages={loadMoreMessages}
            onChessBoardClick={handleChessModalShown}
            onChessSpoilerClick={handleChessSpoilerClick}
            onSendFileMessage={handleSendFileMessage}
            partnerId={partnerId}
            statusText={renderStatusMessage()}
          />
          {socketConnected ? (
            <ChatInput
              loading={loading}
              onChange={setChatMessage}
              message={chatMessage}
              myId={userId}
              isTwoPeopleChannel={currentChannel.twoPeople}
              currentChannelId={selectedChannelId}
              currentChannel={currentChannel}
              onChessButtonClick={handleChessModalShown}
              onMessageSubmit={onMessageSubmit}
              onHeightChange={height => {
                if (height !== textAreaHeight) {
                  setTextAreaHeight(height > 46 ? height : 0);
                }
              }}
              onPlusButtonClick={() => FileInputRef.current.click()}
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
            channelId={selectedChannelId}
            chessCountdownObj={chessCountdownObj}
            myId={userId}
            onConfirmChessMove={handleConfirmChessMove}
            onHide={() => setChessModalShown(false)}
            onSpoilerClick={handleChessSpoilerClick}
            {...getOpponentInfo()}
          />
        )}
        {alertModalShown && (
          <AlertModal
            title="File is too large"
            content={`The file size is larger than your limit of ${maxSize /
              mb} MB`}
            onHide={() => setAlertModalShown(false)}
          />
        )}
        {uploadModalShown && (
          <UploadModal
            channelId={selectedChannelId}
            fileObj={fileObj}
            onHide={() => setUploadModalShown(false)}
            subjectId={subjectId}
          />
        )}
      </div>
    </Context.Provider>
  );

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

  function handleChessModalShown() {
    const channelId = currentChannel?.id;
    if (chessCountdownObj[channelId] !== 0) {
      setChessModalShown(true);
    }
  }

  function handleChessSpoilerClick() {
    socket.emit('viewed_chess_move', selectedChannelId);
    socket.emit('start_chess_timer', currentChannel);
    setChessModalShown(true);
  }

  function handleSendFileMessage(params) {
    socket.emit('new_chat_message', params, {
      ...currentChannel,
      numUnreads: 1,
      lastMessage: {
        fileName: params.fileName,
        sender: { id: userId, username }
      },
      channelName
    });
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    setFileObj(file);
    setUploadModalShown(true);
    event.target.value = null;
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

  async function onMessageSubmit(content) {
    setTextAreaHeight(0);
    let isFirstDirectMessage = selectedChannelId === 0;
    if (isFirstDirectMessage) {
      const { members, message } = await startNewDMChannel({
        content,
        userId,
        partnerId,
        dispatch
      });
      sendFirstDirectMessage({ members, message });
      socket.emit('join_chat_channel', message.channelId);
      socket.emit('send_bi_chat_invitation', partnerId, message);
      return;
    }
    const params = {
      userId,
      username,
      profilePicId,
      content,
      channelId: selectedChannelId,
      subjectId
    };
    try {
      submitMessage(params);
      socket.emit('new_chat_message', params, {
        ...currentChannel,
        numUnreads: 1,
        lastMessage: {
          content,
          sender: { id: userId, username }
        },
        channelName
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleConfirmChessMove({ state, isCheckmate, isStalemate }) {
    const gameWinnerId = isCheckmate ? userId : isStalemate ? 0 : undefined;
    const params = {
      userId,
      chessState: state,
      isChessMsg: 1,
      gameWinnerId
    };
    const content = 'Made a chess move';
    try {
      if (selectedChannelId) {
        submitMessage({
          ...params,
          profilePicId,
          username,
          content,
          channelId: selectedChannelId
        });
        socket.emit('user_made_a_move', {
          userId,
          channelId: selectedChannelId
        });
        socket.emit(
          'new_chat_message',
          {
            ...params,
            content,
            username,
            profilePicId,
            channelId: selectedChannelId
          },
          {
            ...currentChannel,
            numUnreads: 1,
            lastMessage: {
              gameWinnerId,
              sender: { id: userId, username },
              content
            },
            channelName: username
          }
        );
      } else {
        const { members, message } = await startNewDMChannel({
          ...params,
          content,
          partnerId,
          dispatch
        });
        sendFirstDirectMessage({ members, message });
        socket.emit('join_chat_channel', message.channelId);
        socket.emit('send_bi_chat_invitation', partnerId, message);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onNewButtonClick() {
    setCreateNewChannelModalShown(true);
  }

  async function onChannelEnter(id) {
    if (id === 0) {
      setCurrentChannelOnlineMembers([]);
      return enterEmptyChat();
    }
    updateSelectedChannelId(id);
    const data = await loadChatChannel({ channelId: id, dispatch });
    enterChannelWithId({ data });
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
    let messageIsForCurrentChannel = message.channelId === selectedChannelId;
    let senderIsNotTheUser = message.userId !== userId;
    if (messageIsForCurrentChannel && senderIsNotTheUser) {
      receiveMessage({ message, pageVisible });
    }
    if (!messageIsForCurrentChannel) {
      receiveMessageOnDifferentChannel({
        senderIsNotTheUser,
        channel: {
          id: 2,
          lastUpdate: message.timeStamp,
          isHidden: false,
          channelName: 'General',
          lastMessage: {
            content: message.content,
            sender: {
              id: message.userId,
              username: message.username
            }
          },
          numUnreads: 1
        }
      });
    }
  }

  function onChatInvitation(data) {
    let duplicate = false;
    if (selectedChannelId === 0) {
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
    await editChannelTitle({ title, channelId: selectedChannelId });
    setEditTitleModalShown(false);
  }

  function onHideChat() {
    hideChat(selectedChannelId);
  }

  function onLeaveChannel() {
    leaveChannel(selectedChannelId);
    socket.emit('leave_chat_channel', {
      channelId: selectedChannelId,
      userId,
      username,
      profilePicId
    });
    setLeaveConfirmModalShown(false);
  }

  function renderStatusMessage() {
    const { opponentId, opponentName } = getOpponentInfo();
    return memberObj.current[opponentId]?.channelObj[selectedChannelId]
      ?.makingChessMove
      ? `${opponentName} is thinking...`
      : '';
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
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
      dispatch(ChatActions.updateChessMoveViewTimeStamp(params)),
    updateSelectedChannelId: channelId =>
      dispatch(ChatActions.updateSelectedChannelId(channelId))
  })
)(Chat);
