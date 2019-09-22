import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  clearNumUnreads,
  clearRecentChessMessage,
  initChat,
  onReceiveMessage,
  receiveMessageOnDifferentChannel,
  receiveFirstMsg,
  enterChannelWithId,
  enterEmptyChat,
  onLoadMoreChannels,
  onLoadMoreMessages,
  createNewChannel,
  sendFirstDirectMessage,
  submitMessage,
  notifyThatMemberLeftChannel,
  openDirectMessageChannel,
  updateChessMoveViewTimeStamp,
  updateSelectedChannelId
} from 'redux/actions/ChatActions';
import CreateNewChannelModal from './Modals/CreateNewChannel';
import UserListModal from 'components/Modals/UserListModal';
import LeftMenu from './LeftMenu';
import MessagesContainer from './MessagesContainer';
import ChessModal from './Modals/ChessModal';
import Loading from 'components/Loading';
import LocalContext from './Context';
import { mobileMaxWidth } from 'constants/css';
import { socket } from 'constants/io';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { objectify } from 'helpers';
import { useAppContext } from 'context';

Chat.propTypes = {
  channelLoadMoreButtonShown: PropTypes.bool,
  channels: PropTypes.array.isRequired,
  clearNumUnreads: PropTypes.func.isRequired,
  createNewChannel: PropTypes.func,
  currentChannel: PropTypes.object,
  enterChannelWithId: PropTypes.func,
  enterEmptyChat: PropTypes.func,
  initChat: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMoreButton: PropTypes.bool,
  onLoadMoreChannels: PropTypes.func.isRequired,
  onLoadMoreMessages: PropTypes.func,
  messages: PropTypes.array,
  notifyThatMemberLeftChannel: PropTypes.func,
  onFileUpload: PropTypes.func,
  openDirectMessageChannel: PropTypes.func,
  profilePicId: PropTypes.number,
  recepientId: PropTypes.number,
  onReceiveMessage: PropTypes.func,
  receiveMessageOnDifferentChannel: PropTypes.func,
  receiveFirstMsg: PropTypes.func,
  selectedChannelId: PropTypes.number,
  sendFirstDirectMessage: PropTypes.func,
  submitMessage: PropTypes.func,
  subjectId: PropTypes.number,
  updateChessMoveViewTimeStamp: PropTypes.func.isRequired,
  updateSelectedChannelId: PropTypes.func.isRequired
};

function Chat({
  channels,
  channelLoadMoreButtonShown,
  clearNumUnreads,
  currentChannel,
  createNewChannel,
  enterChannelWithId,
  enterEmptyChat,
  initChat,
  loaded,
  loadMoreButton,
  onLoadMoreChannels,
  onLoadMoreMessages,
  messages,
  notifyThatMemberLeftChannel,
  onFileUpload,
  openDirectMessageChannel,
  recepientId,
  profilePicId,
  receiveFirstMsg,
  onReceiveMessage,
  receiveMessageOnDifferentChannel,
  selectedChannelId,
  sendFirstDirectMessage,
  subjectId,
  submitMessage,
  updateChessMoveViewTimeStamp,
  updateSelectedChannelId
}) {
  const {
    user: {
      state: { userId, username }
    },
    view: {
      state: { pageVisible }
    },
    requestHelpers: {
      createNewChat,
      loadChat,
      loadChatChannel,
      loadDMChannel,
      loadMoreChannels,
      loadMoreChatMessages,
      startNewDMChannel,
      updateChatLastRead
    }
  } = useAppContext();
  const [channelLoading, setChannelLoading] = useState(false);
  const [
    currentChannelOnlineMembers,
    setCurrentChannelOnlineMembers
  ] = useState([]);
  const [createNewChannelModalShown, setCreateNewChannelModalShown] = useState(
    false
  );
  const [userListModalShown, setUserListModalShown] = useState(false);
  const [chessModalShown, setChessModalShown] = useState(false);
  const [chessCountdownObj, setChessCountdownObj] = useState({});
  const [channelName, setChannelName] = useState('');
  const [partner, setPartner] = useState(null);
  const [creatingNewDMChannel, setCreatingNewDMChannel] = useState(false);
  const memberObj = useRef({});
  const channelsObj = useRef({});
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!loaded && userId) {
      init();
    } else {
      if (userId) {
        updateChatLastRead({ channelId: selectedChannelId });
      }
      clearNumUnreads();
    }

    async function init() {
      const data = await loadChat();
      initChat(data);
    }
    return function cleanUp() {
      mounted.current = false;
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
    setPartner(otherMember);
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
    socket.on('notifiy_move_made', onNotifiedMoveMade);
    socket.on('receive_chess_countdown_number', onReceiveCountdownNumber);

    function onNotifyMoveViewed(channelId) {
      if (channelId === selectedChannelId) {
        updateChessMoveViewTimeStamp();
      }
    }

    function onReceiveMessage(message) {
      if (message.isChessMsg) {
        setChessCountdownObj(countdownObj => ({
          ...countdownObj,
          [message.channelId]: undefined
        }));
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

    function onNotifiedMoveMade({ channelId }) {
      if (channelId === selectedChannelId) {
        setChessModalShown(false);
      }
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
      socket.removeListener('notifiy_move_made', onNotifiedMoveMade);
      socket.removeListener(
        'receive_chess_countdown_number',
        onReceiveCountdownNumber
      );
    };
  });

  useEffect(() => {
    setChannelLoading(selectedChannelId !== currentChannel.id);
    socket.emit('check_online_members', selectedChannelId, (err, data) => {
      if (err) console.error(err);
      if (mounted.current) {
        setCurrentChannelOnlineMembers(data.membersOnline);
      }
    });
  }, [currentChannel, selectedChannelId]);

  return (
    <LocalContext.Provider
      value={{
        selectedChannelId,
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
        {loaded ? (
          <>
            {createNewChannelModalShown && (
              <CreateNewChannelModal
                userId={userId}
                onHide={() => setCreateNewChannelModalShown(false)}
                onDone={onCreateNewChannel}
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
              loadMoreChannels={handleLoadMoreChannels}
              onChannelEnter={onChannelEnter}
              onNewButtonClick={onNewButtonClick}
              showUserListModal={() => setUserListModalShown(true)}
            />
            <MessagesContainer
              channelName={channelName}
              chessCountdownObj={chessCountdownObj}
              chessOpponent={partner}
              loading={channelLoading || creatingNewDMChannel}
              currentChannel={currentChannel}
              currentChannelId={selectedChannelId}
              loadMoreButton={loadMoreButton}
              messages={messages}
              loadMoreMessages={handleLoadMoreMessages}
              onShowChessModal={handleChessModalShown}
              onChessBoardClick={handleChessModalShown}
              onChessSpoilerClick={handleChessSpoilerClick}
              onMessageSubmit={handleMessageSubmit}
              onSendFileMessage={handleSendFileMessage}
              recepientId={recepientId}
              selectedChannelId={selectedChannelId}
              subjectId={subjectId}
            />
            {chessModalShown && (
              <ChessModal
                channelId={selectedChannelId}
                chessCountdownObj={chessCountdownObj}
                myId={userId}
                onConfirmChessMove={handleConfirmChessMove}
                onHide={() => setChessModalShown(false)}
                onSpoilerClick={handleChessSpoilerClick}
                opponentId={partner?.id}
                opponentName={partner?.username}
              />
            )}
          </>
        ) : (
          <Loading />
        )}
      </div>
    </LocalContext.Provider>
  );

  function handleChessModalShown() {
    const channelId = currentChannel?.id;
    if (chessCountdownObj[channelId] !== 0) {
      setChessModalShown(true);
    }
  }

  function handleChessSpoilerClick(senderId) {
    if (
      selectedChannelId !== currentChannel.id ||
      senderId === userId ||
      channelLoading ||
      creatingNewDMChannel
    ) {
      return;
    }
    socket.emit('viewed_chess_move', selectedChannelId);
    socket.emit('start_chess_timer', {
      currentChannel,
      targetUserId: userId,
      winnerId: senderId
    });
    setChessModalShown(true);
  }

  async function handleLoadMoreChannels(params) {
    const data = await loadMoreChannels(params);
    onLoadMoreChannels(data);
  }

  async function handleLoadMoreMessages(params) {
    const data = await loadMoreChatMessages(params);
    onLoadMoreMessages(data);
  }

  async function handleMessageSubmit(content) {
    let isFirstDirectMessage = selectedChannelId === 0;
    if (isFirstDirectMessage) {
      if (creatingNewDMChannel) return;
      setCreatingNewDMChannel(true);
      const { members, message } = await startNewDMChannel({
        content,
        userId,
        recepientId
      });
      sendFirstDirectMessage({ members, message });
      socket.emit('join_chat_channel', message.channelId);
      socket.emit('send_bi_chat_invitation', recepientId, message);
      setCreatingNewDMChannel(false);
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

  function userListDescriptionShown(user) {
    for (let i = 0; i < currentChannelOnlineMembers.length; i++) {
      if (user.id === currentChannelOnlineMembers[i].id) return true;
    }
    return false;
  }

  function returnUsers({ members: allMembers }, currentChannelOnlineMembers) {
    return allMembers.length > 0 ? allMembers : currentChannelOnlineMembers;
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
          recepientId
        });
        sendFirstDirectMessage({ members, message });
        socket.emit('join_chat_channel', message.channelId);
        socket.emit('send_bi_chat_invitation', recepientId, message);
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
    const data = await loadChatChannel({ channelId: id });
    enterChannelWithId({ data });
  }

  async function onCreateNewChannel(params) {
    if (params.selectedUsers.length === 1) {
      const recepient = params.selectedUsers[0];
      const data = await loadDMChannel({ recepient });
      openDirectMessageChannel({
        user: { id: userId, username },
        recepient,
        channelData: data
      });
      return setCreateNewChannelModalShown(false);
    }

    const data = await createNewChat(params);
    createNewChannel(data);

    const users = params.selectedUsers.map(user => user.id);
    socket.emit('join_chat_channel', data.message.channelId);
    socket.emit('send_group_chat_invitation', users, data);
    setCreateNewChannelModalShown(false);
  }

  function onSubjectChange({ message }) {
    let messageIsForCurrentChannel = message.channelId === selectedChannelId;
    let senderIsNotTheUser = message.userId !== userId;
    if (messageIsForCurrentChannel && senderIsNotTheUser) {
      onReceiveMessage({ message, pageVisible });
    }
    if (!messageIsForCurrentChannel) {
      receiveMessageOnDifferentChannel({
        senderIsNotTheUser,
        pageVisible,
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
}

export default connect(
  state => ({
    loaded: state.ChatReducer.loaded,
    currentChannel: state.ChatReducer.currentChannel,
    selectedChannelId: state.ChatReducer.selectedChannelId,
    channels: state.ChatReducer.channels,
    messages: state.ChatReducer.messages,
    channelLoadMoreButtonShown: state.ChatReducer.channelLoadMoreButton,
    loadMoreButton: state.ChatReducer.loadMoreMessages,
    recepientId: state.ChatReducer.recepientId,
    subjectId: state.ChatReducer.subject.id
  }),
  {
    clearNumUnreads,
    clearRecentChessMessage,
    initChat,
    onReceiveMessage,
    receiveMessageOnDifferentChannel,
    receiveFirstMsg,
    enterChannelWithId,
    enterEmptyChat,
    onLoadMoreChannels,
    onLoadMoreMessages,
    createNewChannel,
    sendFirstDirectMessage,
    submitMessage,
    notifyThatMemberLeftChannel,
    openDirectMessageChannel,
    updateChessMoveViewTimeStamp,
    updateSelectedChannelId
  }
)(Chat);
