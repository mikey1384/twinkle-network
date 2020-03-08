import React, { useEffect, useMemo, useRef } from 'react';
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
      onCall,
      onChangeAwayStatus,
      onChangeBusyStatus,
      onSetReconnecting,
      onChangeChannelOwner,
      onChangeChannelSettings,
      onClearRecentChessMessage,
      onHideAttachment,
      onCallReceptionConfirm,
      onDeleteMessage,
      onEditMessage,
      onGetNumberOfUnreadMessages,
      onInitChat,
      onReceiveFirstMsg,
      onReceiveMessage,
      onReceiveMessageOnDifferentChannel,
      onReceiveVocabActivity,
      onSetPeerStreams,
      onShowIncoming,
      onUpdateCollectorsRankings
    }
  } = useChatContext();

  const {
    state: { numNewNotis, numNewPosts, totalRewardAmount, versionMatch },
    actions: {
      onChangeSocketStatus,
      onCheckVersion,
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
  const incomingPeersRef = useRef({});
  const outgoingRef = useRef({});
  const prevMyStreamRef = useRef(null);
  const prevIncomingShown = useRef(false);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [userId]);

  useEffect(() => {
    if (userId && profilePicId !== prevProfilePicId.current) {
      socket.emit('change_profile_pic', profilePicId);
    }
    prevProfilePicId.current = profilePicId;
  }, [profilePicId, userId, username]);

  const currentChannelMembers = useMemo(() => {
    return (
      channelsObj[selectedChannelId]?.members
        ?.map(({ id }) => id)
        .filter(id => id !== userId) || []
    );
  }, [channelsObj, selectedChannelId, userId]);

  useEffect(() => {
    socket.on('answer_signal_received', handleAnswer);
    socket.on('away_status_changed', handleAwayStatusChange);
    socket.on('busy_status_changed', handleBusyStatusChange);
    socket.on('call_hung_up', handleCallHungUp);
    socket.on('call_reception_confirmed', onCallReceptionConfirm);
    socket.on('call_signal_received', handleCall);
    socket.on('chat_invitation_received', onChatInvitation);
    socket.on('chat_message_deleted', onDeleteMessage);
    socket.on('chat_message_edited', onEditMessage);
    socket.on('channel_owner_changed', onChangeChannelOwner);
    socket.on('channel_settings_changed', onChangeChannelSettings);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message_attachment_hid', onHideAttachment);
    socket.on('new_post_uploaded', onIncreaseNumNewPosts);
    socket.on('new_notification_received', onIncreaseNumNewNotis);
    socket.on('new_message_received', handleReceiveMessage);
    socket.on('peer_accepted', handlePeerAccept);
    socket.on('peer_received', handlePeer);
    socket.on('subject_changed', onSubjectChange);
    socket.on('new_vocab_activity_received', handleReceiveVocabActivity);

    return function cleanUp() {
      socket.removeListener('answer_signal_received', handleAnswer);
      socket.removeListener('away_status_changed', handleAwayStatusChange);
      socket.removeListener('busy_status_changed', handleBusyStatusChange);
      socket.removeListener('connect', onConnect);
      socket.removeListener('call_hung_up', handleCallHungUp);
      socket.removeListener('call_reception_confirmed', onCallReceptionConfirm);
      socket.removeListener('call_signal_received', handleCall);
      socket.removeListener('chat_invitation_received', onChatInvitation);
      socket.removeListener('channel_owner_changed', onChangeChannelOwner);
      socket.removeListener(
        'channel_settings_changed',
        onChangeChannelSettings
      );
      socket.removeListener('disconnect', onDisconnect);
      socket.removeListener('chat_message_deleted', onDeleteMessage);
      socket.removeListener('chat_message_edited', onEditMessage);
      socket.removeListener('message_attachment_hid', onHideAttachment);
      socket.removeListener('new_post_uploaded', onIncreaseNumNewPosts);
      socket.removeListener('new_notification_received', onIncreaseNumNewNotis);
      socket.removeListener('new_message_received', handleReceiveMessage);
      socket.removeListener('peer_accepted', handlePeerAccept);
      socket.removeListener('peer_received', handlePeer);
      socket.removeListener('subject_changed', onSubjectChange);
      socket.removeListener(
        'new_vocab_activity_received',
        handleReceiveVocabActivity
      );
    };

    function onChatInvitation(data) {
      let duplicate = false;
      if (selectedChannelId === 0) {
        if (
          data.members.filter(member => member.userId !== userId)[0].userId ===
          channelsObj[selectedChannelId].members.filter(
            member => member.userId !== userId
          )[0].userId
        ) {
          duplicate = true;
        }
      }
      onReceiveFirstMsg({ data, duplicate, pageVisible });
      socket.emit('join_chat_channel', data.channelId);
    }
    async function onConnect() {
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
      if (chatState['user' + userId]?.isAway !== isAway) {
        onChangeAwayStatus({ userId, isAway });
      }
    }

    function handleBusyStatusChange({ userId, isBusy }) {
      if (chatState['user' + userId]?.isBusy !== isBusy) {
        onChangeBusyStatus({ userId, isBusy });
      }
    }

    function handlePeer({ channelId, peerId, to }) {
      if (to === userId) {
        incomingPeersRef.current[peerId] = {};
        socket.emit('inform_peer_signal_accepted', { peerId, channelId });
        onCall({ channelId: channelId, callerId: peerId });
      }
    }

    function handlePeerAccept({ channelId, to, peerId }) {
      if (to === userId) {
        try {
          outgoingRef.current[peerId] = new Peer({
            config: {
              iceServers: [
                {
                  urls: 'turn:18.177.176.36:3478?transport=udp',
                  username: 'test',
                  credential: 'test'
                }
              ]
            }
          });

          outgoingRef.current[peerId].on('signal', signal => {
            socket.emit('send_answer_signal', {
              peerId,
              signal,
              channelId
            });
          });

          outgoingRef.current[peerId].on('close', () => {
            delete outgoingRef.current[peerId];
          });
          outgoingRef.current[peerId].on('stream', stream => {
            outgoingRef.current[peerId].addStream(myStream);
            onShowIncoming();
            onSetPeerStreams({ peerId, stream });
          });
          outgoingRef.current[peerId].on('error', e => {
            console.error('Peer error %s:', peerId, e);
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    function handleCallHungUp({ channelId, peerId }) {
      console.log('hung up', channelId, peerId);
      onCall({});
    }

    function handleAnswer(data) {
      const peerId = data.from;
      if (
        incomingPeersRef.current[peerId] &&
        incomingPeersRef.current[peerId].signal
      ) {
        try {
          incomingPeersRef.current[peerId].signal(data.signal);
        } catch (error) {
          console.error(error);
        }
      }
    }

    function handleCall({ peerId, signal, to }) {
      if (to === userId && outgoingRef.current[peerId]) {
        try {
          try {
            outgoingRef.current[peerId].signal(signal);
          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    function onDisconnect() {
      console.log('disconnected from socket');
      onChangeSocketStatus(false);
    }

    async function handleReceiveMessage(message, channel) {
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
          usingChat
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
    function onSubjectChange({ subject }) {
      onNotifyChatSubjectChange(subject);
    }
  });

  useEffect(() => {
    const newNotiNum = numNewPosts + numNewNotis + numUnreads;
    document.title = `${newNotiNum > 0 ? '(' + newNotiNum + ') ' : ''}Twinkle`;
  }, [numNewNotis, numNewPosts, numUnreads, pathname]);

  useEffect(() => {
    onShowUpdateNotice(!versionMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionMatch]);

  useEffect(() => {
    if (
      !prevMyStreamRef.current &&
      myStream &&
      channelOnCall.callerId !== userId
    ) {
      try {
        for (let [, peer] of Object.entries(incomingPeersRef.current)) {
          peer.addStream(myStream);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [channelOnCall.callerId, myStream, userId]);

  useEffect(() => {
    if (
      userId === channelOnCall.callerId &&
      myStream &&
      !prevMyStreamRef.current
    ) {
      for (let memberId of currentChannelMembers) {
        socket.emit('send_peer', {
          to: memberId,
          channelId: channelOnCall.id
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOnCall.callerId, channelOnCall.id, myStream, userId]);

  useEffect(() => {
    if (channelOnCall.incomingShown && !prevIncomingShown.current) {
      for (let peerId of Object.keys(incomingPeersRef.current)) {
        incomingPeersRef.current[peerId] = new Peer({
          config: {
            iceServers: [
              {
                urls: 'turn:18.177.176.36:3478?transport=udp',
                username: 'test',
                credential: 'test'
              }
            ]
          },
          initiator: true
        });

        incomingPeersRef.current[peerId].on('signal', signal => {
          socket.emit('send_call_signal', {
            socketId: peerId,
            signal,
            channelId: channelOnCall.id
          });
        });

        incomingPeersRef.current[peerId].on('stream', stream => {
          onSetPeerStreams({ peerId, stream });
        });

        incomingPeersRef.current[peerId].on('close', () => {
          delete incomingPeersRef.current[peerId];
        });

        incomingPeersRef.current[peerId].on('error', e => {
          console.error('Peer error %s:', peerId, e);
        });
      }
    }
    prevIncomingShown.current = channelOnCall.incomingShown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOnCall.incomingShown]);

  useEffect(() => {
    prevMyStreamRef.current = myStream;
  }, [myStream]);

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
            className={`desktop ${css`
              margin-right: 3rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-right: 0;
              }
            `}`}
            history={history}
          />
        </div>
      </nav>
    </ErrorBoundary>
  );
}
