import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MessagesContainer from './MessagesContainer';
import { connect } from 'react-redux';
import * as ChatActions from 'redux/actions/ChatActions';
import ChatInput from './ChatInput';
import CreateNewChannelModal from './Modals/CreateNewChannel';
import InviteUsersModal from './Modals/InviteUsers';
import EditTitleModal from './Modals/EditTitle';
import ConfirmModal from 'components/Modals/ConfirmModal';
import UserListModal from 'components/Modals/UserListModal';
import DropdownButton from 'components/Buttons/DropdownButton';
import LeftMenu from './LeftMenu';
import Loading from 'components/Loading';
import { GENERAL_CHAT_ID } from 'constants/database';
import { mobileMaxWidth, Color } from 'constants/css';
import { socket } from 'constants/io';
import { css } from 'emotion';

const channelName = (channels, currentChannel) => {
  for (let i = 0; i < channels.length; i++) {
    if (channels[i].id === currentChannel.id) {
      return channels[i].channelName;
    }
  }
  return null;
};

class Chat extends Component {
  static propTypes = {
    onUnmount: PropTypes.func.isRequired,
    notifyThatMemberLeftChannel: PropTypes.func,
    currentChannel: PropTypes.object,
    channels: PropTypes.array.isRequired,
    selectedChannelId: PropTypes.number,
    userId: PropTypes.number,
    loadMoreButton: PropTypes.bool,
    loadMoreChannels: PropTypes.func.isRequired,
    channelLoadMoreButtonShown: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func,
    submitMessage: PropTypes.func,
    username: PropTypes.string,
    profilePicId: PropTypes.number,
    sendFirstDirectMessage: PropTypes.func,
    partnerId: PropTypes.number,
    enterChannelWithId: PropTypes.func,
    enterEmptyChat: PropTypes.func,
    createNewChannel: PropTypes.func,
    receiveMessage: PropTypes.func,
    receiveMessageOnDifferentChannel: PropTypes.func,
    receiveFirstMsg: PropTypes.func,
    socketConnected: PropTypes.bool,
    editChannelTitle: PropTypes.func,
    hideChat: PropTypes.func,
    leaveChannel: PropTypes.func,
    openDirectMessageChannel: PropTypes.func,
    pageVisible: PropTypes.bool,
    subjectId: PropTypes.number
  };

  state = {
    chatMessage: '',
    loading: false,
    currentChannelOnlineMembers: [],
    leaveConfirmModalShown: false,
    createNewChannelModalShown: false,
    inviteUsersModalShown: false,
    userListModalShown: false,
    editTitleModalShown: false,
    onTitleHover: false,
    listScrollPosition: 0,
    textAreaHeight: 0
  };

  componentDidMount() {
    this.mounted = true;
    const { notifyThatMemberLeftChannel, currentChannel } = this.props;
    socket.on('receive_message', this.onReceiveMessage);
    socket.on('subject_change', this.onSubjectChange);
    socket.on('chat_invitation', this.onChatInvitation);
    socket.on('change_in_members_online', data => {
      let forCurrentChannel = data.channelId === this.props.currentChannel.id;
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
        if (this.mounted) {
          this.setState({
            currentChannelOnlineMembers: data.membersOnline
          });
        }
      }
    });
    socket.emit('check_online_members', currentChannel.id, (err, data) => {
      if (err) console.error(err);
      if (this.mounted) {
        this.setState({ currentChannelOnlineMembers: data.membersOnline });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { currentChannel } = this.props;

    if (prevProps.selectedChannelId !== this.props.selectedChannelId) {
      this.setState({ loading: true });
    }

    if (prevProps.currentChannel.id !== currentChannel.id) {
      socket.emit('check_online_members', currentChannel.id, (err, data) => {
        if (err) console.error(err);
        if (this.mounted) {
          this.setState({
            currentChannelOnlineMembers: data.membersOnline,
            loading: false
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    const { onUnmount } = this.props;
    socket.removeListener('receive_message', this.onReceiveMessage);
    socket.removeListener('chat_invitation', this.onChatInvitation);
    socket.removeListener('subject_change', this.onSubjectChange);
    socket.removeListener('change_in_members_online');
    onUnmount();
  }

  render() {
    const {
      channels,
      currentChannel,
      loadMoreChannels,
      userId,
      channelLoadMoreButtonShown,
      selectedChannelId,
      socketConnected
    } = this.props;
    const {
      chatMessage,
      loading,
      leaveConfirmModalShown,
      createNewChannelModalShown,
      inviteUsersModalShown,
      userListModalShown,
      editTitleModalShown,
      currentChannelOnlineMembers,
      textAreaHeight
    } = this.state;

    let menuProps = currentChannel.twoPeople
      ? [{ label: 'Hide Chat', onClick: this.onHideChat }]
      : [
          {
            label: 'Invite People',
            onClick: () => this.setState({ inviteUsersModalShown: true })
          },
          {
            label: 'Edit Channel Name',
            onClick: () => this.setState({ editTitleModalShown: true })
          },
          {
            separator: true
          },
          {
            label: 'Leave Channel',
            onClick: () => this.setState({ leaveConfirmModalShown: true })
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
            onHide={() => this.setState({ leaveConfirmModalShown: false })}
            onConfirm={this.onLeaveChannel}
          />
        )}
        {createNewChannelModalShown && (
          <CreateNewChannelModal
            userId={userId}
            onHide={() => this.setState({ createNewChannelModalShown: false })}
            onDone={this.onCreateNewChannel}
          />
        )}
        {inviteUsersModalShown && (
          <InviteUsersModal
            onHide={() => this.setState({ inviteUsersModalShown: false })}
            currentChannel={currentChannel}
            onDone={this.onInviteUsersDone}
          />
        )}
        {editTitleModalShown && (
          <EditTitleModal
            title={channelName(channels, currentChannel)}
            onHide={() => this.setState({ editTitleModalShown: false })}
            onDone={this.onEditTitleDone}
          />
        )}
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            users={this.returnUsers(
              currentChannel,
              currentChannelOnlineMembers
            )}
            descriptionShown={this.userListDescriptionShown}
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
          onChannelEnter={this.onChannelEnter}
          onNewButtonClick={this.onNewButtonClick}
          selectedChannelId={selectedChannelId}
          showUserListModal={() => this.setState({ userListModalShown: true })}
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
              snow
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
            currentChannelId={this.props.currentChannel.id}
            loadMoreButton={this.props.loadMoreButton}
            messages={this.props.messages}
            userId={this.props.userId}
            loadMoreMessages={this.props.loadMoreMessages}
          />
          {socketConnected ? (
            <ChatInput
              style={{ width: 'CALC(100% - 1rem)' }}
              onChange={text => this.setState({ chatMessage: text })}
              message={chatMessage}
              currentChannelId={this.props.currentChannel.id}
              onMessageSubmit={this.onMessageSubmit}
              onHeightChange={height => {
                if (height !== this.state.textAreaHeight) {
                  this.setState({ textAreaHeight: height > 46 ? height : 0 });
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
      </div>
    );
  }

  userListDescriptionShown = user => {
    const { currentChannelOnlineMembers } = this.state;
    let result = false;
    for (let i = 0; i < currentChannelOnlineMembers.length; i++) {
      if (user.id === currentChannelOnlineMembers[i].id) result = true;
    }
    return result;
  };

  returnUsers = ({ members: allMembers }, currentChannelOnlineMembers) => {
    return allMembers.length > 0 ? allMembers : currentChannelOnlineMembers;
  };

  onMessageSubmit = message => {
    const {
      submitMessage,
      userId,
      username,
      profilePicId,
      currentChannel,
      channels,
      sendFirstDirectMessage,
      partnerId,
      subjectId
    } = this.props;
    this.setState({ textAreaHeight: 0 });
    let isFirstDirectMessage = currentChannel.id === 0;
    if (isFirstDirectMessage) {
      return sendFirstDirectMessage({ message, userId, partnerId }).then(
        chat => {
          socket.emit('join_chat_channel', chat.channelId);
          socket.emit('send_bi_chat_invitation', partnerId, chat);
        }
      );
    }

    let params = {
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
    submitMessage(params).then(message =>
      socket.emit('new_chat_message', message, channel)
    );
  };

  onNewButtonClick = () => {
    this.setState({ createNewChannelModalShown: true });
  };

  onChannelEnter = id => {
    const { enterChannelWithId, enterEmptyChat } = this.props;
    if (id === 0) {
      this.setState({ currentChannelOnlineMembers: [] });
      return enterEmptyChat();
    }
    enterChannelWithId(id);
  };

  onCreateNewChannel = async params => {
    const {
      createNewChannel,
      username,
      userId,
      openDirectMessageChannel
    } = this.props;
    if (params.selectedUsers.length === 1) {
      const partner = params.selectedUsers[0];
      await openDirectMessageChannel({ username, id: userId }, partner, true);
      return this.setState({ createNewChannelModalShown: false });
    }

    const data = await createNewChannel(params);
    const users = params.selectedUsers.map(user => user.id);
    socket.emit('join_chat_channel', data.message.channelId);
    socket.emit('send_group_chat_invitation', users, data);
    this.setState({ createNewChannelModalShown: false });
  };

  onReceiveMessage = (message, channel) => {
    const {
      pageVisible,
      receiveMessage,
      receiveMessageOnDifferentChannel,
      currentChannel,
      userId
    } = this.props;
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
  };

  onSubjectChange = ({ message }) => {
    const {
      pageVisible,
      receiveMessage,
      receiveMessageOnDifferentChannel,
      currentChannel,
      userId
    } = this.props;
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
  };

  onChatInvitation = data => {
    const { receiveFirstMsg, currentChannel, pageVisible, userId } = this.props;
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
  };

  onInviteUsersDone = (users, message) => {
    socket.emit('new_chat_message', {
      ...message,
      channelId: message.channelId
    });
    socket.emit('send_group_chat_invitation', users, {
      message: { ...message, messageId: message.id }
    });
    this.setState({ inviteUsersModalShown: false });
  };

  onEditTitleDone = async title => {
    const { editChannelTitle, currentChannel } = this.props;
    await editChannelTitle({ title, channelId: currentChannel.id });
    this.setState({ editTitleModalShown: false });
  };

  onHideChat = () => {
    const { hideChat, currentChannel } = this.props;
    hideChat(currentChannel.id);
  };

  onLeaveChannel = () => {
    const {
      leaveChannel,
      currentChannel,
      userId,
      username,
      profilePicId
    } = this.props;
    leaveChannel(currentChannel.id);
    socket.emit('leave_chat_channel', {
      channelId: currentChannel.id,
      userId,
      username,
      profilePicId
    });
    this.setState({ leaveConfirmModalShown: false });
  };
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
  {
    receiveMessage: ChatActions.receiveMessage,
    receiveMessageOnDifferentChannel:
      ChatActions.receiveMessageOnDifferentChannel,
    receiveFirstMsg: ChatActions.receiveFirstMsg,
    enterChannelWithId: ChatActions.enterChannelWithId,
    enterEmptyChat: ChatActions.enterEmptyChat,
    submitMessage: ChatActions.submitMessageAsync,
    loadMoreChannels: ChatActions.loadMoreChannels,
    loadMoreMessages: ChatActions.loadMoreMessages,
    createNewChannel: ChatActions.createNewChannel,
    sendFirstDirectMessage: ChatActions.sendFirstDirectMessage,
    hideChat: ChatActions.hideChat,
    leaveChannel: ChatActions.leaveChannel,
    editChannelTitle: ChatActions.editChannelTitle,
    notifyThatMemberLeftChannel: ChatActions.notifyThatMemberLeftChannel,
    openDirectMessageChannel: ChatActions.openDirectMessageChannel
  }
)(Chat);
