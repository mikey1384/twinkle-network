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
import Button from 'components/Button';
import ChatSearchBox from './ChatSearchBox';
import { GENERAL_CHAT_ID } from 'constants/database';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { textIsOverflown } from 'helpers';
import FullTextReveal from 'components/FullTextReveal';
import { socket } from 'constants/io';
import { queryStringForArray } from 'helpers/stringHelpers';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { chatStyle, channelContainer } from './Styles';
import { css } from 'emotion';
import { Color } from 'constants/css';
import Loading from 'components/Loading';

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
    channels: PropTypes.array,
    selectedChannelId: PropTypes.number,
    userId: PropTypes.number,
    loadMoreButton: PropTypes.bool,
    channelLoadMoreButtonShown: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func,
    loadMoreChannels: PropTypes.func,
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
    channelsLoading: false,
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
    addEvent(this.channelList, 'scroll', this.onListScroll);
  }

  componentDidUpdate(prevProps) {
    const { currentChannel } = this.props;

    if (
      prevProps.channels[0] !== this.props.channels[0] &&
      currentChannel.id === this.props.channels[0].id
    ) {
      this.channelList.scrollTop = 0;
    }

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
    removeEvent(this.channelList, 'scroll', this.onScroll);
    onUnmount();
  }

  render() {
    const {
      channels,
      currentChannel,
      userId,
      channelLoadMoreButtonShown,
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
      onTitleHover,
      currentChannelOnlineMembers,
      channelsLoading,
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
      <div className={chatStyle}>
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
        <div className={channelContainer}>
          <div
            className={css`
              width: 100%;
              padding: 1rem;
              display: grid;
              grid-template-columns: fr fr fr 10rem;
              grid-template-areas: 'channelDetail channelDetail channelDetail newButton';
              justify-items: stretch;
            `}
          >
            <div
              className={css`
                grid-area: channelDetail;
                display: grid;
                grid-template-colums: 15rem fr;
                grid-template-rows: fr fr;
                grid-template-areas:
                  '. channelName'
                  '. channelMembers';
              `}
            >
              <span
                ref={ref => {
                  this.channelTitle = ref;
                }}
                style={{
                  gridArea: 'channelName',
                  textAlign: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 'normal',
                  cursor: 'default',
                  color: !channelName(channels, currentChannel) && '#7c7c7c'
                }}
                onMouseOver={this.onMouseOverTitle}
                onMouseLeave={() => this.setState({ onTitleHover: false })}
              >
                {channelName(channels, currentChannel)
                  ? channelName(channels, currentChannel)
                  : '(Deleted)'}
              </span>
              <FullTextReveal
                text={channelName(channels, currentChannel) || ''}
                show={onTitleHover}
                width="100%"
                style={{ top: '4rem' }}
              />
              {currentChannel.id !== 0 ? (
                <small
                  style={{ gridArea: 'channelMembers', textAlign: 'center' }}
                >
                  <a
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={() => this.setState({ userListModalShown: true })}
                  >
                    {this.renderNumberOfMembers()}
                  </a>{' '}
                  online
                </small>
              ) : (
                <small>{'\u00a0'}</small>
              )}
            </div>
            <Button
              transparent
              style={{
                gridArea: 'newButton',
                justifySelf: 'right',
                alignSelf: 'center'
              }}
              onClick={this.onNewButtonClick}
            >
              +New
            </Button>
          </div>
          <ChatSearchBox />
          <div
            style={{
              overflow: 'scroll',
              position: 'absolute',
              top: '11.5rem',
              left: 0,
              right: 0,
              bottom: 0
            }}
            ref={ref => {
              this.channelList = ref;
            }}
          >
            {this.renderChannels()}
            {channelLoadMoreButtonShown && (
              <LoadMoreButton
                success
                filled
                loading={channelsLoading}
                onClick={this.loadMoreChannels}
                style={{
                  width: '100%',
                  borderRadius: 0,
                  border: 0
                }}
              />
            )}
          </div>
        </div>
        <div
          className={css`
            height: CALC(100% - 1rem);
            margin-top: 1rem;
            width: CALC(75% - 2rem);
            margin-left: 1rem;
            padding: 1rem;
            position: relative;
            background: #fff;
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
                style={{ height: '2.5rem' }}
                innerStyle={{ fontSize: '2rem' }}
                text="Socket disconnected. Reconnecting..."
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  renderChannels = () => {
    const { userId, currentChannel, channels, selectedChannelId } = this.props;
    return channels.filter(channel => !channel.isHidden).map(channel => {
      const {
        lastMessageSender,
        lastMessage,
        id,
        channelName,
        numUnreads
      } = channel;
      return (
        <div
          className={css`
            &:hover {
              background: ${Color.wellGray()};
            }
          `}
          style={{
            width: '100%',
            backgroundColor: id === selectedChannelId && Color.channelGray(),
            cursor: 'pointer',
            padding: '1rem',
            height: '6.5rem'
          }}
          onClick={() => this.onChannelEnter(id)}
          key={id}
        >
          <div
            style={{
              display: 'flex',
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '85%',
                height: '100%',
                whiteSpace: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4
                  style={{
                    color: !channelName && '#7c7c7c',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 'normal'
                  }}
                >
                  {channelName || '(Deleted)'}
                </h4>
              </div>
              <div
                style={{
                  width: '100%',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {lastMessageSender && lastMessage
                  ? `${
                      lastMessageSender.id === userId
                        ? 'You'
                        : lastMessageSender.username
                    }: ${lastMessage}`
                  : '\u00a0'}
              </div>
            </div>
            {id !== currentChannel.id &&
              numUnreads > 0 && (
                <div
                  style={{
                    background: Color.pink(),
                    display: 'flex',
                    color: '#fff',
                    fontWeight: 'bold',
                    minWidth: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {numUnreads}
                </div>
              )}
          </div>
        </div>
      );
    });
  };

  loadMoreChannels = () => {
    const { currentChannel, channels, loadMoreChannels } = this.props;
    const { channelsLoading } = this.state;
    if (!channelsLoading) {
      this.setState({ channelsLoading: true });
      loadMoreChannels(
        currentChannel.id,
        queryStringForArray({
          array: channels,
          originVar: 'id',
          destinationVar: 'channelIds'
        })
      ).then(() => this.setState({ channelsLoading: false }));
    }
  };

  renderNumberOfMembers = () => {
    const { currentChannel } = this.props;
    const { currentChannelOnlineMembers } = this.state;
    const numberOfMembers = currentChannel.members.length;
    return `${currentChannelOnlineMembers.length || 1}${
      numberOfMembers <= 1 ? '' : '/' + numberOfMembers
    }`;
  };

  userListDescriptionShown = user => {
    const { currentChannelOnlineMembers } = this.state;
    let result = false;
    for (let i = 0; i < currentChannelOnlineMembers.length; i++) {
      if (user.userId === currentChannelOnlineMembers[i].userId) result = true;
    }
    return result;
  };

  returnUsers = ({ members: allMembers }, currentChannelOnlineMembers) => {
    return allMembers.length > 0 ? allMembers : currentChannelOnlineMembers;
  };

  onListScroll = () => {
    if (
      this.channelList.scrollTop >=
      (this.channelList.scrollHeight - this.channelList.offsetHeight) * 0.7
    ) {
      this.loadMoreChannels();
    }
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
      return openDirectMessageChannel(
        { username, id: userId },
        partner,
        true
      ).then(() => this.setState({ createNewChannelModalShown: false }));
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

  onMouseOverTitle = () => {
    if (textIsOverflown(this.channelTitle)) {
      this.setState({ onTitleHover: true });
    }
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
