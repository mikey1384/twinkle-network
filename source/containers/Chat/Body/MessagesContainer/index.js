import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ConfirmModal from 'components/Modals/ConfirmModal';
import ChatInput from './ChatInput';
import Loading from 'components/Loading';
import Message from '../Message';
import ChannelHeader from './ChannelHeader';
import UploadModal from '../Modals/UploadModal';
import InviteUsersModal from '../Modals/InviteUsers';
import AlertModal from 'components/Modals/AlertModal';
import SelectNewOwnerModal from '../Modals/SelectNewOwnerModal';
import SettingsModal from '../Modals/SettingsModal';
import { GENERAL_CHAT_ID } from 'constants/database';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';
import { css } from 'emotion';
import { useChatContext, useNotiContext } from 'contexts';

MessagesContainer.propTypes = {
  loading: PropTypes.bool,
  onChessSpoilerClick: PropTypes.func.isRequired,
  onShowChessModal: PropTypes.func.isRequired
};

export default function MessagesContainer({
  loading,
  onChessSpoilerClick,
  onShowChessModal
}) {
  const {
    state: { replyTarget }
  } = useChatContext();
  const {
    state: { socketConnected }
  } = useNotiContext();
  const MessagesRef = useRef(null);
  const MessagesContainerRef = useRef({});
  const [textAreaHeight, setTextAreaHeight] = useState(0);
  const [newUnseenMessage, setNewUnseenMessage] = useState(false);
  const [fileObj, setFileObj] = useState('');
  const [inviteUsersModalShown, setInviteUsersModalShown] = useState(false);
  const [uploadModalShown, setUploadModalShown] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [leaveConfirmModalShown, setLeaveConfirmModalShown] = useState(false);
  const [selectNewOwnerModalShown, setSelectNewOwnerModalShown] = useState(
    false
  );
  const containerHeight = useMemo(() => {
    return `CALC(100% - 1rem - 2px - ${
      textAreaHeight ? `${textAreaHeight}px - 1rem` : '5.5rem'
    }${replyTarget ? ' - 12rem - 2px' : ''})`;
  }, [replyTarget, textAreaHeight]);
  const fillerHeight = useMemo(
    () =>
      MessagesContainerRef.current?.offsetHeight >
      MessagesRef.current?.offsetHeight
        ? MessagesContainerRef.current?.offsetHeight -
          MessagesRef.current?.offsetHeight
        : 20,
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      MessagesContainerRef.current?.offsetHeight,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      MessagesRef.current?.offsetHeight
    ]
  );

  useEffect(() => {
    const MessagesContainer = MessagesContainerRef.current;
    mounted.current = true;
    addEvent(MessagesContainer, 'scroll', handleScroll);

    return function cleanUp() {
      mounted.current = false;
      removeEvent(MessagesContainer, 'scroll', handleScroll);
    };

    function handleScroll() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (MessagesContainerRef.current.scrollTop === 0) {
          handleLoadMore();
        }
      }, 200);
    }
  });

  useEffect(() => {
    if (messagesLoaded) {
      setTimeout(() => {
        MessagesContainerRef.current.scrollTop =
          ContentRef.current?.offsetHeight || 0;
        onChannelLoadingDone();
      }, 0);
      setScrollAtBottom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesLoaded, reconnecting]);

  return (
    <div>
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
      />
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
          -webkit-overflow-scrolling: touch;
        `}
        style={{
          height: containerHeight
        }}
      >
        {loading && <Loading />}
        <div
          ref={MessagesContainerRef}
          style={{
            position: 'absolute',
            left: '1rem',
            right: '0',
            bottom: '0',
            opacity: loading ? 0 : 1,
            top: selectedChannelId === GENERAL_CHAT_ID ? '7rem' : 0,
            overflowY: 'scroll'
          }}
          onScroll={() => {
            if (
              checkScrollIsAtTheBottom({
                content: ContentRef.current,
                container: MessagesContainerRef.current
              })
            ) {
              setScrollAtBottom(true);
              setNewUnseenMessage(false);
            } else {
              setScrollAtBottom(false);
            }
          }}
        >
          <div ref={ContentRef} style={{ width: '100%' }}>
            {!loading && loadMoreButton ? (
              <div
                style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <Button
                  filled
                  color="lightBlue"
                  disabled={loadMoreButtonLock}
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </div>
            ) : (
              <div
                style={{
                  height: fillerHeight + 'px'
                }}
              />
            )}
            <div ref={MessagesRef}>
              {messages.map((message, index) => (
                <Message
                  key={selectedChannelId + (message.id || 'newMessage' + index)}
                  channelId={selectedChannelId}
                  channelName={channelName}
                  chessCountdownObj={chessCountdownObj}
                  chessOpponent={chessOpponent}
                  checkScrollIsAtTheBottom={() =>
                    checkScrollIsAtTheBottom({
                      content: ContentRef.current,
                      container: MessagesContainerRef.current
                    })
                  }
                  currentChannel={currentChannel}
                  index={index}
                  isLastMsg={index === messages.length - 1}
                  isNotification={!!message.isNotification}
                  loading={loading}
                  message={message}
                  onChessBoardClick={onShowChessModal}
                  onChessSpoilerClick={onChessSpoilerClick}
                  onSendFileMessage={onSendFileMessage}
                  onDelete={handleShowDeleteModal}
                  onReceiveNewMessage={handleReceiveNewMessage}
                  onReplyClick={() => ChatInputRef.current.focus()}
                  recepientId={recepientId}
                  setScrollToBottom={handleSetScrollToBottom}
                  showSubjectMsgsModal={({ subjectId, content }) =>
                    setSubjectMsgsModal({ shown: true, subjectId, content })
                  }
                />
              ))}
            </div>
          </div>
        </div>
        {!loading && selectedChannelId === GENERAL_CHAT_ID && <ChannelHeader />}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {newUnseenMessage && (
            <Button
              filled
              color="orange"
              onClick={() => {
                setNewUnseenMessage(false);
                MessagesContainerRef.current.scrollTop =
                  ContentRef.current.offsetHeight;
              }}
            >
              New Message
            </Button>
          )}
        </div>
        {deleteModal.shown && (
          <ConfirmModal
            onHide={() =>
              setDeleteModal({ shown: false, filePath: '', messageId: null })
            }
            title="Remove Message"
            onConfirm={handleDelete}
          />
        )}
      </div>
      <div
        style={{
          background: Color.inputGray(),
          padding: '1rem',
          borderTop: `1px solid ${Color.borderGray()}`
        }}
      >
        {socketConnected ? (
          <ChatInput
            innerRef={ChatInputRef}
            loading={loading}
            myId={userId}
            isTwoPeopleChannel={currentChannel.twoPeople}
            currentChannelId={selectedChannelId}
            currentChannel={currentChannel}
            onChessButtonClick={onShowChessModal}
            onMessageSubmit={content => {
              setTextAreaHeight(0);
              onMessageSubmit(content);
            }}
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
              style={{ height: '4.2rem' }}
              innerStyle={{ fontSize: '2rem' }}
              text="Socket disconnected. Reconnecting..."
            />
          </div>
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
        {inviteUsersModalShown && (
          <InviteUsersModal
            onHide={() => setInviteUsersModalShown(false)}
            currentChannel={currentChannel}
            selectedChannelId={selectedChannelId}
            onDone={handleInviteUsersDone}
          />
        )}
        {settingsModalShown && (
          <SettingsModal
            isClosed={!!currentChannel.isClosed}
            userIsChannelOwner={currentChannel.creatorId === userId}
            channelName={channelName}
            onHide={() => setSettingsModalShown(false)}
            onDone={handleEditSettings}
            channelId={selectedChannelId}
          />
        )}
        {leaveConfirmModalShown && (
          <ConfirmModal
            title="Leave Channel"
            onHide={() => setLeaveConfirmModalShown(false)}
            onConfirm={handleLeaveConfirm}
          />
        )}
        {selectNewOwnerModalShown && (
          <SelectNewOwnerModal
            onHide={() => setSelectNewOwnerModalShown(false)}
            members={currentChannel.members}
            onSubmit={handleSelectNewOwnerAndLeaveChannel}
          />
        )}
      </div>
    </div>
  );

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    setFileObj(file);
    setUploadModalShown(true);
    event.target.value = null;
  }
}
