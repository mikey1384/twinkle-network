import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import { Color } from 'constants/css'
import Loading from 'components/Loading'
import Message from './Message'
import SubjectHeader from './SubjectHeader'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { connect } from 'react-redux'
import { deleteMessage } from 'redux/actions/ChatActions'

const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight <= container.offsetHeight + container.scrollTop
}

class MessagesContainer extends Component {
  static propTypes = {
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
    scrollAtBottom: true,
    newUnseenMessage: false,
    loadMoreButtonLock: false
  }

  componentDidMount() {
    this.setState({
      fillerHeight:
        this.messagesContainer.offsetHeight > this.messages.offsetHeight
          ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
          : 0
    })
    this.setScrollToBottom()
    setTimeout(() => this.setScrollToBottom(), 200)
  }

  componentWillReceiveProps() {
    this.setState({
      scrollAtBottom: scrollIsAtTheBottom(this.content, this.messagesContainer)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages, userId } = this.props
    const messageSenderId = messages[messages.length - 1].userId
    const switchedChannel =
      prevProps.currentChannelId !== this.props.currentChannelId
    const newMessageArrived =
      prevProps.messages.length >= 0 &&
      prevProps.messages.length < this.props.messages.length &&
      prevProps.messages[0].id === this.props.messages[0].id
    const messageDeleted =
      prevProps.currentChannelId === this.props.currentChannelId &&
      prevProps.messages.length > this.props.messages.length
    if (switchedChannel) {
      this.setState({
        fillerHeight:
          this.messagesContainer.offsetHeight > this.messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
            : 0
      })
      this.setScrollToBottom()
      return setTimeout(() => this.setScrollToBottom(), 300)
    }
    if (messageDeleted) {
      this.setState({
        fillerHeight:
          this.messagesContainer.offsetHeight > this.messages.offsetHeight
            ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
            : 0
      })
      return
    }
    if (newMessageArrived) {
      if (messageSenderId !== userId && !this.state.scrollAtBottom) {
        this.setState({ newUnseenMessage: true })
      } else {
        this.setState({
          fillerHeight:
            this.messagesContainer.offsetHeight > this.messages.offsetHeight
              ? this.messagesContainer.offsetHeight - this.messages.offsetHeight
              : 0
        })
        this.setScrollToBottom()
      }
    }
  }

  setScrollToBottom() {
    this.messagesContainer.scrollTop = Math.max(
      this.maxScroll,
      this.messagesContainer.offsetHeight,
      this.state.fillerHeight + this.messages.offsetHeight
    )
    this.maxScroll = this.messagesContainer.scrollTop
  }

  render() {
    const { loadMoreButton, loading, currentChannelId } = this.props
    const { deleteModal, newUnseenMessage } = this.state
    return (
      <div>
        {!!loading && <Loading />}
        <div
          ref={ref => {
            this.messagesContainer = ref
          }}
          className="momentum-scroll-enabled"
          style={{
            position: 'absolute',
            width: '100%',
            height: '91%',
            bottom: '50px',
            opacity: !!loading && '0.3'
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
            style={{
              paddingTop: currentChannelId === 2 ? '4.5rem' : '0px'
            }}
          >
            {loadMoreButton ? (
              <div
                style={{
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}
              >
                <Button
                  className="btn btn-success"
                  style={{ width: '20%' }}
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
                this.messages = ref
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
            bottom: '60px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {newUnseenMessage && (
            <Button
              className="btn btn-warning"
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
              this.setState({ deleteModal: { shown: false, messageId: null } })
            }
            title="Remove Message"
            onConfirm={this.onDelete}
          />
        )}
      </div>
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

  onLoadMoreButtonClick = () => {
    const messageId = this.props.messages[0].id
    const channelId = this.props.messages[0].channelId
    const { userId, loadMoreMessages } = this.props
    const { loadMoreButtonLock } = this.state
    if (!loadMoreButtonLock) {
      this.setState({ loadMoreButtonLock: true })
      loadMoreMessages(userId, messageId, channelId, () => {
        this.setState({ loadMoreButtonLock: false })
      })
    }
  }

  renderMessages = () => {
    const { messages } = this.props
    return messages.map((message, index) => {
      let { isNotification } = message
      let messageStyle = isNotification ? { color: Color.darkGray } : null
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
        />
      )
    })
  }
}

export default connect(null, { deleteMessage })(MessagesContainer)
