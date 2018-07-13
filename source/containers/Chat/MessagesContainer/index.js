import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import Button from 'components/Button'
import { Color } from 'constants/css'
import Loading from 'components/Loading'
import Message from './Message'
import SubjectHeader from './SubjectHeader'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { connect } from 'react-redux'
import { deleteMessage } from 'redux/actions/ChatActions'
import SubjectMsgsModal from '../Modals/SubjectMsgsModal'
import { css } from 'emotion'

const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight <= container.offsetHeight + container.scrollTop
}

class MessagesContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    currentChannelId: PropTypes.number.isRequired,
    loadMoreButton: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func,
    loading: PropTypes.bool
  }

  state = {
    deleteModal: {
      shown: false,
      messageId: null
    },
    fillerHeight: 20,
    maxScroll: 0,
    newUnseenMessage: false,
    loadMoreButtonLock: false,
    subjectMsgsModal: {
      shown: false,
      subjectId: null,
      content: ''
    }
  }

  componentDidMount() {
    this.setScrollToBottom()
    this.setState(
      {
        fillerHeight:
          this.messagesContainer &&
          this.Messages &&
          this.messagesContainer.offsetHeight > this.Messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.Messages.offsetHeight
            : 0
      },
      () => this.setScrollToBottom()
    )
    setTimeout(() => this.setScrollToBottom(), 300)
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return scrollIsAtTheBottom(this.content, this.messagesContainer)
  }

  componentDidUpdate(prevProps, prevState, scrollAtBottom) {
    const { messages, userId } = this.props
    const switchedChannel =
      prevProps.currentChannelId !== this.props.currentChannelId
    const newMessageArrived =
      prevProps.messages.length >= 0 &&
      prevProps.messages.length < this.props.messages.length &&
      (prevProps.messages[0]
        ? prevProps.messages[0].id === this.props.messages[0].id
        : false)
    const messageDeleted =
      prevProps.currentChannelId === this.props.currentChannelId &&
      prevProps.messages.length > this.props.messages.length
    if (switchedChannel) {
      this.setState({
        fillerHeight:
          this.messagesContainer &&
          this.Messages &&
          this.messagesContainer.offsetHeight > this.Messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.Messages.offsetHeight
            : 0
      })
      this.setScrollToBottom()
      return setTimeout(() => this.setScrollToBottom(), 300)
    }
    if (messageDeleted) {
      this.setState({
        fillerHeight:
          this.messagesContainer &&
          this.Messages &&
          this.messagesContainer.offsetHeight > this.Messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.Messages.offsetHeight
            : 0
      })
      return
    }
    if (newMessageArrived) {
      const messageSenderId = messages[messages.length - 1].userId
      if (messageSenderId !== userId && !scrollAtBottom) {
        this.setState({ newUnseenMessage: true })
      } else {
        this.setState({
          fillerHeight:
            this.messagesContainer &&
            this.Messages &&
            this.messagesContainer.offsetHeight > this.Messages.offsetHeight
              ? this.messagesContainer.offsetHeight - this.Messages.offsetHeight
              : 0
        })
        this.setScrollToBottom()
      }
    }
  }

  setScrollToBottom() {
    this.messagesContainer.scrollTop = Math.max(
      this.state.maxScroll,
      this.messagesContainer.offsetHeight,
      this.state.fillerHeight + ((this.messages || {}).offsetHeight || 0)
    )
    this.setState({ maxScroll: this.messagesContainer.scrollTop })
  }

  render() {
    const { className, loadMoreButton, loading, currentChannelId } = this.props
    const {
      deleteModal,
      loadMoreButtonLock,
      newUnseenMessage,
      subjectMsgsModal
    } = this.state
    return (
      <Fragment>
        {subjectMsgsModal.shown && (
          <SubjectMsgsModal
            subjectId={subjectMsgsModal.subjectId}
            subjectTitle={subjectMsgsModal.content}
            onHide={() =>
              this.setState({
                subjectMsgsModal: { shown: false, subjectId: null, content: '' }
              })
            }
          />
        )}
        <div className={className}>
          {loading && <Loading absolute />}
          <div
            ref={ref => {
              this.messagesContainer = ref
            }}
            className={css`
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
            `}
            style={{
              opacity: loading && '0.3',
              top: currentChannelId === 2 ? '6rem' : 0,
              overflowY: 'scroll'
            }}
            onScroll={() => {
              const content = this.content
              const container = this.messagesContainer
              if (scrollIsAtTheBottom(content, container)) {
                this.setState({ newUnseenMessage: false })
              }
            }}
          >
            <div
              ref={ref => {
                this.content = ref
              }}
            >
              {loadMoreButton ? (
                <div
                  style={{
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}
                >
                  <Button
                    filled
                    info
                    style={{ marginTop: '1rem' }}
                    disabled={loadMoreButtonLock}
                    onClick={this.onLoadMoreButtonClick}
                  >
                    Load More
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    height: this.state.fillerHeight + 'px'
                  }}
                />
              )}
              <div
                ref={ref => {
                  this.Messages = ref
                }}
              >
                {this.renderMessages()}
              </div>
            </div>
          </div>
          {!loading && currentChannelId === 2 && <SubjectHeader />}
          <div
            style={{
              position: 'absolute',
              bottom: '3rem',
              textAlign: 'center',
              width: '100%'
            }}
          >
            {newUnseenMessage && (
              <Button
                filled
                warning
                onClick={() => {
                  this.setState({ newUnseenMessage: false })
                  const content = this.content
                  const container = this.messagesContainer
                  container.scrollTop = Math.max(
                    container.offsetHeight,
                    content.offsetHeight
                  )
                }}
              >
                New Message
              </Button>
            )}
          </div>
          {deleteModal.shown && (
            <ConfirmModal
              onHide={() =>
                this.setState({
                  deleteModal: { shown: false, messageId: null }
                })
              }
              title="Remove Message"
              onConfirm={this.onDelete}
            />
          )}
        </div>
      </Fragment>
    )
  }

  onDelete = async() => {
    const { deleteMessage } = this.props
    const { messageId } = this.state.deleteModal
    try {
      await deleteMessage(messageId)
      this.setState({ deleteModal: { shown: false, messageId: null } })
    } catch (error) {
      console.error(error)
    }
  }

  onLoadMoreButtonClick = async() => {
    const messageId = this.props.messages[0].id
    const channelId = this.props.messages[0].channelId
    const { userId, loadMoreMessages } = this.props
    const { loadMoreButtonLock } = this.state
    if (!loadMoreButtonLock) {
      this.setState({ loadMoreButtonLock: true })
      await loadMoreMessages(userId, messageId, channelId)
      this.setState({ loadMoreButtonLock: false })
    }
  }

  renderMessages = () => {
    const { messages } = this.props
    return messages.map((message, index) => {
      let { isNotification } = message
      let messageStyle = isNotification ? { color: Color.gray() } : null
      return (
        <Message
          key={index}
          onDelete={messageId =>
            this.setState({
              deleteModal: {
                shown: true,
                messageId
              }
            })
          }
          index={index}
          style={messageStyle}
          message={message}
          isLastMsg={index === messages.length - 1}
          setScrollToBottom={this.setScrollToBottom.bind(this)}
          showSubjectMsgsModal={({ subjectId, content }) =>
            this.setState({
              subjectMsgsModal: { shown: true, subjectId, content }
            })
          }
        />
      )
    })
  }
}

export default connect(
  null,
  { deleteMessage }
)(MessagesContainer)
