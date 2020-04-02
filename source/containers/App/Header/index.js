import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AccountMenu from './AccountMenu';
import MainNavs from './MainNavs';
import TwinkleLogo from './TwinkleLogo';
import ErrorBoundary from 'components/ErrorBoundary';
import Peer from 'simple-peer';
import { css } from 'emotion';
import { Color, mobileMaxWidth, desktopMinWidth } from 'constants/css';
import { socket } from 'constants/io';
import { getSectionFromPathname } from 'helpers';
import { useHistory, useLocation } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import {
  useAppContext,
  useViewContext,
  useNotiContext,
  useChatContext
} from 'contexts';

Header.propTypes = {
  onChatButtonClick: PropTypes.func,
  onMobileMenuOpen: PropTypes.func,
  style: PropTypes.object
};

export default function Header({
  onChatButtonClick,
  onMobileMenuOpen,
  style = {}
}) {
  const { pathname } = useLocation();
  const history = useHistory();
  const usingChat = getSectionFromPathname(pathname)?.section === 'chat';
  const {
    requestHelpers: {
      checkVersion,
      getNumberOfUnreadMessages,
      loadChat,
      loadRankings,
      updateChatLastRead
    }
  } = useAppContext();
  const {
    defaultSearchFilter,
    userId,
    username,
    loggedIn,
    profilePicId
  } = useMyState();
  const {
    state: {
      channelOnCall,
      channelsObj,
      chatType,
      selectedChannelId,
      myStream,
      numUnreads,
      ...chatState
    },
    actions: {
      onSetCall,
      onChangeAwayStatus,
      onChangeBusyStatus,
      onSetImLive,
      onSetReconnecting,
      onChangeChannelOwner,
      onChangeChannelSettings,
      onClearRecentChessMessage,
      onHideAttachment,
      onCallReceptionConfirm,
      onDeleteMessage,
      onEditMessage,
      onGetNumberOfUnreadMessages,
      onHangUp,
      onInitChat,
      onReceiveFirstMsg,
      onReceiveMessage,
      onReceiveMessageOnDifferentChannel,
      onReceiveVocabActivity,
      onSetMembersOnCall,
      onSetMyStream,
      onSetPeerStreams,
      onShowIncoming,
      onShowOutgoing,
      onTogglePeerStream,
      onUpdateCollectorsRankings
    }
  } = useChatContext();

  const {
    state: { numNewNotis, numNewPosts, totalRewardAmount, versionMatch },
    actions: {
      onChangeSocketStatus,
      onCheckVersion,
      onGetRanks,
      onIncreaseNumNewPosts,
      onIncreaseNumNewNotis,
      onNotifyChatSubjectChange,
      onShowUpdateNotice
    }
  } = useNotiContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const prevProfilePicId = useRef(profilePicId);
  const peersRef = useRef({});
  const prevMyStreamRef = useRef(null);
  const prevIncomingShown = useRef(false);
  const membersOnCall = useRef({});
  const receivedCallSignals = useRef([]);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [userId]);

  useEffect(() => {
    socket.on('signal_received', handleCallSignal);
    socket.on('away_status_changed', handleAwayStatusChange);
    socket.on('busy_status_changed', handleBusyStatusChange);
    socket.on('call_terminated', handleCallTerminated);
    socket.on('call_reception_confirmed', handleCallReceptionConfirm);
    socket.on('chat_invitation_received', handleChatInvitation);
    socket.on('chat_message_deleted', onDeleteMessage);
    socket.on('chat_message_edited', onEditMessage);
    socket.on('channel_owner_changed', onChangeChannelOwner);
    socket.on('channel_settings_changed', onChangeChannelSettings);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('message_attachment_hid', onHideAttachment);
    socket.on('new_call_member', handleNewCallMember);
    socket.on('new_call_started', handlePeer);
    socket.on('new_post_uploaded', onIncreaseNumNewPosts);
    socket.on('new_notification_received', onIncreaseNumNewNotis);
    socket.on('new_message_received', handleReceiveMessage);
    socket.on('peer_accepted', handlePeerAccepted);
    socket.on('peer_hung_up', handlePeerHungUp);
    socket.on('peer_stream_show_requested', handlePeerStreamShowRequest);
    socket.on('peer_stream_close_requested', handlePeerStreamCloseRequest);
    socket.on('peer_stream_enabled', handlePeerStreamEnable);
    socket.on('subject_changed', handleSubjectChange);
    socket.on('new_vocab_activity_received', handleReceiveVocabActivity);

    return function cleanUp() {
      socket.removeListener('signal_received', handleCallSignal);
      socket.removeListener('away_status_changed', handleAwayStatusChange);
      socket.removeListener('busy_status_changed', handleBusyStatusChange);
      socket.removeListener('call_terminated', handleCallTerminated);
      socket.removeListener(
        'call_reception_confirmed',
        handleCallReceptionConfirm
      );
      socket.removeListener('chat_invitation_received', handleChatInvitation);
      socket.removeListener('chat_message_deleted', onDeleteMessage);
      socket.removeListener('chat_message_edited', onEditMessage);
      socket.removeListener('channel_owner_changed', onChangeChannelOwner);
      socket.removeListener(
        'channel_settings_changed',
        onChangeChannelSettings
      );
      socket.removeListener('connect', handleConnect);
      socket.removeListener('disconnect', handleDisconnect);
      socket.removeListener('message_attachment_hid', onHideAttachment);
      socket.removeListener('new_call_member', handleNewCallMember);
      socket.removeListener('new_call_started', handlePeer);
      socket.removeListener('new_post_uploaded', onIncreaseNumNewPosts);
      socket.removeListener('new_notification_received', onIncreaseNumNewNotis);
      socket.removeListener('new_message_received', handleReceiveMessage);
      socket.removeListener('peer_accepted', handlePeerAccepted);
      socket.removeListener('peer_hung_up', handlePeerHungUp);
      socket.removeListener(
        'peer_stream_show_requested',
        handlePeerStreamShowRequest
      );
      socket.removeListener(
        'peer_stream_close_requested',
        handlePeerStreamCloseRequest
      );
      socket.removeListener('peer_stream_enabled', handlePeerStreamEnable);
      socket.removeListener('subject_changed', handleSubjectChange);
      socket.removeListener(
        'new_vocab_activity_received',
        handleReceiveVocabActivity
      );
    };

    async function handleConnect() {
      console.log('connected to socket');
      onClearRecentChessMessage();
      onChangeSocketStatus(true);
      handleCheckVersion();
      if (userId) {
        handleGetNumberOfUnreadMessages();
        socket.emit('bind_uid_to_socket', { userId, username, profilePicId });
        socket.emit('enter_my_notification_channel', userId);
        handleLoadChat();
      }

      async function handleLoadChat() {
        onSetReconnecting(true);
        const data = await loadChat();
        onInitChat(data);
      }

      async function handleCheckVersion() {
        const data = await checkVersion();
        onCheckVersion(data);
      }

      async function handleGetNumberOfUnreadMessages() {
        const numUnreads = await getNumberOfUnreadMessages();
        onGetNumberOfUnreadMessages(numUnreads);
      }
    }

    function handleAwayStatusChange({ userId, isAway }) {
      if (
        chatState['user' + userId] &&
        chatState['user' + userId].isAway !== isAway
      ) {
        onChangeAwayStatus({ userId, isAway });
      }
    }

    function handleBusyStatusChange({ userId, isBusy }) {
      if (
        chatState['user' + userId] &&
        chatState['user' + userId].isBusy !== isBusy
      ) {
        onChangeBusyStatus({ userId, isBusy });
      }
    }

    function handleCallTerminated() {
      onSetCall({});
      onSetMyStream(null);
      onSetPeerStreams({});
      onSetMembersOnCall({});
      membersOnCall.current = {};
      peersRef.current = {};
      prevMyStreamRef.current = null;
      prevIncomingShown.current = false;
      receivedCallSignals.current = [];
    }

    function handleCallReceptionConfirm(channelId) {
      onCallReceptionConfirm(channelId);
    }

    function handleCallSignal({ peerId, signal, to }) {
      if (to === userId && peersRef.current[peerId]) {
        if (peersRef.current[peerId].signal) {
          try {
            peersRef.current[peerId].signal(signal);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }

    function handleChatInvitation({ message, members, isClass }) {
      let duplicate = false;
      if (selectedChannelId === 0) {
        if (
          members.filter(member => member.userId !== userId)[0].userId ===
          channelsObj[selectedChannelId].members.filter(
            member => member.userId !== userId
          )[0].userId
        ) {
          duplicate = true;
        }
      }
      onReceiveFirstMsg({ message, duplicate, isClass, pageVisible });
      socket.emit('join_chat_channel', message.channelId);
    }

    function handleDisconnect(reason) {
      console.log('disconnected from socket. reason: ', reason);
      onChangeSocketStatus(false);
    }

    function handleNewCallMember({ socketId, memberId }) {
      if (!channelOnCall.members?.[memberId]) {
        onSetMembersOnCall({ [memberId]: socketId });
      }
      membersOnCall.current[socketId] = true;
    }

    function handlePeer({ memberId, channelId, peerId }) {
      if (memberId !== userId && !membersOnCall.current[peerId]) {
        onSetCall({
          channelId,
          isClass: channelsObj[selectedChannelId]?.isClass
        });
      }
      if (!channelOnCall.members?.[memberId]) {
        onSetMembersOnCall({ [memberId]: peerId });
      }
      membersOnCall.current[peerId] = true;
    }

    function handlePeerAccepted({ channelId, to, peerId }) {
      if (to === userId) {
        try {
          handleNewPeer({
            peerId,
            channelId,
            stream: channelOnCall.isClass
              ? channelsObj[channelOnCall.id].creatorId === userId ||
                channelOnCall.imLive
                ? myStream
                : null
              : myStream
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    function handlePeerHungUp({ channelId, memberId, peerId }) {
      if (Number(channelId) === Number(channelOnCall.id)) {
        delete membersOnCall.current[peerId];
        onHangUp({ peerId, memberId, iHungUp: memberId === userId });
      }
    }

    function handlePeerStreamShowRequest() {
      if (myStream) {
        if (
          myStream.getVideoTracks()[0].enabled &&
          myStream.getAudioTracks()[0].enabled
        ) {
          for (let peerId in membersOnCall.current) {
            try {
              if (peersRef.current[peerId]) {
                peersRef.current[peerId].addStream(myStream);
              }
            } catch (error) {
              console.error(error);
            }
          }
          onSetImLive(true);
        } else {
          myStream.getVideoTracks()[0].enabled = true;
          myStream.getAudioTracks()[0].enabled = true;
          socket.emit('notify_stream_enabled', {
            channelId: channelOnCall.id,
            memberId: userId
          });
          onSetImLive(true);
        }
      }
    }

    async function handlePeerStreamCloseRequest(memberId) {
      if (memberId === userId) {
        myStream.getVideoTracks()[0].enabled = false;
        myStream.getAudioTracks()[0].enabled = false;
        onSetImLive(false);
      } else {
        onTogglePeerStream({
          peerId: channelOnCall.members[memberId],
          hidden: true
        });
      }
    }

    async function handlePeerStreamEnable(memberId) {
      if (memberId !== userId) {
        onTogglePeerStream({
          peerId: channelOnCall.members[memberId],
          hidden: false
        });
      }
    }

    async function handleReceiveMessage({ message, channel, newMembers }) {
      const messageIsForCurrentChannel =
        message.channelId === selectedChannelId;
      const senderIsNotTheUser = message.userId !== userId;
      if (messageIsForCurrentChannel && senderIsNotTheUser) {
        if (usingChat) {
          await updateChatLastRead(message.channelId);
        }
        onReceiveMessage({
          message,
          pageVisible,
          usingChat,
          newMembers
        });
      }
      if (!messageIsForCurrentChannel) {
        onReceiveMessageOnDifferentChannel({
          channel,
          senderIsNotTheUser,
          pageVisible,
          usingChat
        });
      }
      if (message.targetMessage?.userId === userId && message.rewardAmount) {
        fetchRankings();
      }
      async function fetchRankings() {
        const { all, top30s } = await loadRankings();
        onGetRanks({ all, top30s });
      }
    }

    function handleReceiveVocabActivity(activity) {
      const senderIsNotTheUser = activity.userId !== userId;
      if (senderIsNotTheUser) {
        onReceiveVocabActivity({
          activity,
          usingVocabSection: chatType === 'vocabulary'
        });
        onUpdateCollectorsRankings({
          id: activity.userId,
          username: activity.username,
          profilePicId: activity.profilePicId,
          numWordsCollected: activity.numWordsCollected,
          rank: activity.rank
        });
      }
    }

    function handleSubjectChange({ subject }) {
      onNotifyChatSubjectChange(subject);
    }
  });

  useEffect(() => {
    socket.emit(
      'check_online_members',
      selectedChannelId,
      (err, { callData, membersOnline }) => {
        if (err) console.error(err);
        if (callData && Object.keys(membersOnCall.current).length === 0) {
          const membersHash = {};
          for (let member of Object.entries(membersOnline)
            .map(([, member]) => member)
            .filter(member => !!callData.peers[member.socketId])) {
            membersHash[member.id] = member.socketId;
          }
          onSetCall({
            channelId: selectedChannelId,
            isClass: channelsObj[selectedChannelId]?.isClass
          });
          onSetMembersOnCall(membersHash);
          membersOnCall.current = callData.peers;
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  useEffect(() => {
    if (userId && profilePicId !== prevProfilePicId.current) {
      socket.emit('change_profile_pic', profilePicId);
    }
    prevProfilePicId.current = profilePicId;
  }, [profilePicId, userId, username]);

  useEffect(() => {
    if (
      !prevIncomingShown.current &&
      channelOnCall.incomingShown &&
      !channelOnCall.imCalling
    ) {
      for (let peerId in membersOnCall.current) {
        socket.emit('inform_peer_signal_accepted', {
          peerId,
          channelId: channelOnCall.id
        });
        socket.emit('join_call', { channelId: channelOnCall.id, userId });
        handleNewPeer({
          peerId: peerId,
          channelId: channelOnCall.id,
          initiator: true
        });
        if (!channelOnCall.isClass) {
          onSetImLive(true);
        }
      }
    }
    prevIncomingShown.current = channelOnCall.incomingShown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOnCall.id, channelOnCall.incomingShown, channelOnCall.imCalling]);

  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + numUnreads;
    document.title = `${newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''}Twinkle`;
  }, [numNewNotis, numNewPosts, numUnreads, pathname]);

  useEffect(() => {
    onShowUpdateNotice(!versionMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionMatch]);

  useEffect(() => {
    if (myStream && !prevMyStreamRef.current) {
      if (channelOnCall.imCalling) {
        socket.emit('start_new_call', channelOnCall.id);
      } else if (!channelOnCall.isClass) {
        for (let peerId in membersOnCall.current) {
          try {
            if (peersRef.current[peerId]) {
              peersRef.current[peerId].addStream(myStream);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
    prevMyStreamRef.current = myStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOnCall.isClass, myStream]);

  return (
    <ErrorBoundary>
      <nav
        className={`unselectable ${css`
          z-index: 30000;
          position: relative;
          font-family: sans-serif, Arial, Helvetica;
          font-size: 1.7rem;
          background: #fff;
          display: flex;
          box-shadow: 0 3px 3px -3px ${Color.black(0.6)};
          align-items: center;
          width: 100%;
          margin-bottom: 0px;
          height: 4.5rem;
          @media (min-width: ${desktopMinWidth}) {
            top: 0;
          }
          @media (max-width: ${mobileMaxWidth}) {
            bottom: 0;
            height: 5rem;
            border-top: 1px solid ${Color.borderGray()};
          }
        `}`}
        style={{
          justifyContent: 'space-around',
          position: 'fixed',
          ...style
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TwinkleLogo style={{ marginLeft: '3rem' }} />
          <MainNavs
            loggedIn={loggedIn}
            defaultSearchFilter={defaultSearchFilter}
            numChatUnreads={numUnreads}
            numNewNotis={numNewNotis}
            numNewPosts={numNewPosts}
            onChatButtonClick={onChatButtonClick}
            onMobileMenuOpen={onMobileMenuOpen}
            pathname={pathname}
            totalRewardAmount={totalRewardAmount}
          />
          <AccountMenu
            className={css`
              margin-right: 3rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-right: 0;
              }
            `}
            history={history}
          />
        </div>
      </nav>
    </ErrorBoundary>
  );

  function handleNewPeer({ peerId, channelId, initiator, stream }) {
    if (initiator || channelOnCall.members[userId]) {
      peersRef.current[peerId] = new Peer({
        config: {
          iceServers: [
            {
              urls: 'turn:18.177.176.36:3478?transport=udp',
              username: 'test',
              credential: 'test'
            }
          ]
        },
        initiator,
        stream
      });

      peersRef.current[peerId].on('signal', signal => {
        socket.emit('send_signal', {
          socketId: peerId,
          signal,
          channelId
        });
      });

      peersRef.current[peerId].on('stream', stream => {
        onShowIncoming();
        onSetPeerStreams({ peerId, stream });
      });

      peersRef.current[peerId].on('connect', () => {
        onShowOutgoing();
      });

      peersRef.current[peerId].on('close', () => {
        delete peersRef.current[peerId];
      });

      peersRef.current[peerId].on('error', e => {
        console.error('Peer error %s:', peerId, e);
      });
    }
  }
}
