import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Loading from 'components/Loading';
import Message from '../Message';
import SubjectHeader from './SubjectHeader';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { connect } from 'react-redux';
import { deleteMessage } from 'redux/actions/ChatActions';
import SubjectMsgsModal from '../Modals/SubjectMsgsModal';

MessagesContainer.propTypes = {
  channelName: PropTypes.string,
  chessCountdownObj: PropTypes.object,
  chessOpponent: PropTypes.object,
  className: PropTypes.string.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  loadMoreButton: PropTypes.bool,
  loading: PropTypes.bool,
  loadMoreMessages: PropTypes.func,
  currentChannel: PropTypes.object,
  currentChannelId: PropTypes.number.isRequired,
  messages: PropTypes.array,
  onChessBoardClick: PropTypes.func,
  onChessSpoilerClick: PropTypes.func,
  onSendFileMessage: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  selectedChannelId: PropTypes.number,
  statusText: PropTypes.string,
  userId: PropTypes.number.isRequired
};

function MessagesContainer({
  channelName,
  chessCountdownObj,
  chessOpponent,
  className,
  deleteMessage,
  loadMoreButton,
  loading,
  loadMoreMessages,
  currentChannel,
  currentChannelId,
  messages,
  onChessBoardClick,
  onChessSpoilerClick,
  onSendFileMessage,
  recepientId,
  selectedChannelId,
  statusText,
  userId
}) {
  const [deleteModal, setDeleteModal] = useState({
    shown: false,
    fileName: '',
    filePath: '',
    messageId: null
  });
  const [fillerHeight, setFillerHeight] = useState(20);
  const [loadMoreButtonLock, setLoadMoreButtonLock] = useState(false);
  const [subjectMsgsModal, setSubjectMsgsModal] = useState({
    shown: false,
    subjectId: null,
    content: ''
  });
  const [newUnseenMessage, setNewUnseenMessage] = useState(false);
  const scrollAtBottom = useRef(true);
  const MessagesRef = useRef({});
  const ContentRef = useRef({});
  const MessagesContainerRef = useRef({});
  const maxScroll = useRef(0);
  const prevMessages = useRef(messages || []);
  const prevStatusText = useRef('');

  useEffect(() => {
    const newMessageArrived =
      prevMessages.current.length >= 0 &&
      prevMessages.current.length < messages.length &&
      (prevMessages.current[0]
        ? prevMessages.current[0].id === messages[0].id
        : false);
    const statusTextAppeared = !prevStatusText.current && !!statusText;
    if (newMessageArrived || statusTextAppeared) {
      const messageSenderId = messages[messages.length - 1].userId;
      if (messageSenderId === userId || scrollAtBottom.current) {
        setFillerHeight(
          MessagesContainerRef.current.offsetHeight >
            MessagesRef.current.offsetHeight
            ? MessagesContainerRef.current.offsetHeight -
                MessagesRef.current.offsetHeight
            : 0
        );
        handleSetScrollToBottom();
      } else {
        setNewUnseenMessage(true);
      }
    }
  }, [messages, statusText]);

  useEffect(() => {
    setFillerHeight(
      MessagesContainerRef.current.offsetHeight >
        MessagesRef.current.offsetHeight
        ? MessagesContainerRef.current.offsetHeight -
            MessagesRef.current.offsetHeight
        : 0
    );
  }, [currentChannel.id]);

  useEffect(() => {
    if (prevMessages.current.length > messages.length) {
      setFillerHeight(
        MessagesContainerRef.current.offsetHeight >
          MessagesRef.current.offsetHeight
          ? MessagesContainerRef.current.offsetHeight -
              MessagesRef.current.offsetHeight
          : 0
      );
    }
    if (prevMessages.current.length === 0 && messages.length === 1) {
      handleSetScrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    prevMessages.current = messages;
  }, [messages]);

  useEffect(() => {
    prevStatusText.current = statusText;
  }, [statusText]);

  useEffect(() => {
    handleSetScrollToBottom();
  }, [currentChannel.id]);

  return (
    <>
      {subjectMsgsModal.shown && (
        <SubjectMsgsModal
          subjectId={subjectMsgsModal.subjectId}
          subjectTitle={subjectMsgsModal.content}
          onHide={() =>
            setSubjectMsgsModal({
              shown: false,
              subjectId: null,
              content: ''
            })
          }
        />
      )}
      <div className={className}>
        {loading && <Loading />}
        <div
          ref={MessagesContainerRef}
          style={{
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            opacity: loading && '0.3',
            top: currentChannelId === 2 ? '7rem' : 0,
            overflowY: 'scroll'
          }}
          onScroll={() => {
            if (
              checkScrollIsAtTheBottom({
                content: ContentRef.current,
                container: MessagesContainerRef.current
              })
            ) {
              scrollAtBottom.current = true;
              setNewUnseenMessage(false);
            } else {
              scrollAtBottom.current = false;
            }
          }}
        >
          <div ref={ContentRef} style={{ width: '100%' }}>
            {loadMoreButton ? (
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
                  onClick={handleLoadMoreButtonClick}
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
                  key={message.id || 'newMessage' + index}
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
                  onDelete={handleShowDeleteModal}
                  index={index}
                  onChessBoardClick={onChessBoardClick}
                  onChessSpoilerClick={onChessSpoilerClick}
                  onSendFileMessage={onSendFileMessage}
                  isNotification={!!message.isNotification}
                  message={message}
                  isLastMsg={index === messages.length - 1}
                  recepientId={recepientId}
                  setScrollToBottom={handleSetScrollToBottom}
                  showSubjectMsgsModal={({ subjectId, content }) =>
                    setSubjectMsgsModal({ shown: true, subjectId, content })
                  }
                />
              ))}
            </div>
            {statusText && (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                {statusText}
              </div>
            )}
          </div>
        </div>
        {!loading && currentChannelId === 2 && <SubjectHeader />}
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
                MessagesContainerRef.current.scrollTop = Math.max(
                  MessagesContainerRef.current.offsetHeight,
                  ContentRef.current.offsetHeight
                );
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
    </>
  );

  function checkScrollIsAtTheBottom({ content, container }) {
    return content.offsetHeight <= container.offsetHeight + container.scrollTop;
  }

  async function handleDelete() {
    const { fileName, filePath, messageId } = deleteModal;
    try {
      await deleteMessage({ fileName, filePath, messageId });
      setDeleteModal({
        shown: false,
        fileName: '',
        filePath: '',
        messageId: null
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLoadMoreButtonClick() {
    const messageId = messages[0].id;
    const channelId = messages[0].channelId;
    if (!loadMoreButtonLock) {
      setLoadMoreButtonLock(true);
      await loadMoreMessages({ userId, messageId, channelId });
      setLoadMoreButtonLock(false);
    }
  }

  function handleShowDeleteModal({ fileName, filePath, messageId }) {
    setDeleteModal({
      shown: true,
      fileName,
      filePath,
      messageId
    });
  }

  function handleSetScrollToBottom() {
    if (MessagesContainerRef.current) {
      MessagesContainerRef.current.scrollTop = Math.max(
        maxScroll.current,
        MessagesContainerRef.current.offsetHeight || 0,
        fillerHeight + (MessagesRef.current.offsetHeight || 0)
      );
      maxScroll.current = MessagesContainerRef.current.scrollTop;
    }
    scrollAtBottom.current = true;
  }
}

export default connect(
  null,
  { deleteMessage }
)(MessagesContainer);
