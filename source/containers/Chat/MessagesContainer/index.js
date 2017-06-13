import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Button from 'components/Button'
import {Color} from 'constants/css'
import Loading from 'components/Loading'
import Message from './Message'
import SubjectHeader from './SubjectHeader'

const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight <= container.offsetHeight + container.scrollTop
}

export default class MessagesContainer extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    currentChannelId: PropTypes.number.isRequired,
    loadMoreButton: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func,
    loading: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      fillerHeight: 0,
      scrollAtBottom: true,
      newUnseenMessage: false,
      loadMoreButtonLock: false
    }
    this.onLoadMoreButtonClick = this.onLoadMoreButtonClick.bind(this)
  }

  componentDidMount() {
    this.setFillerHeight()
  }

  componentWillReceiveProps() {
    const content = this.content
    const container = this.messagesContainer
    this.setState({scrollAtBottom: scrollIsAtTheBottom(content, container)})
  }

  componentDidUpdate(prevProps, prevState) {
    const switchedChannel = prevProps.currentChannelId !== this.props.currentChannelId
    const newMessageArrived = this.props.messages.length !== 0 && prevProps.messages !== this.props.messages
    const loadedPrevMessage =
      !switchedChannel && prevProps.messages.length !== 0 && prevProps.messages[0] !== this.props.messages[0]

    if (loadedPrevMessage) return
    if (switchedChannel) return this.setFillerHeight()
    if (newMessageArrived) {
      let {messages, userId} = this.props
      let messageSenderId = messages[messages.length - 1].userId
      if (messageSenderId === userId || this.state.scrollAtBottom) {
        this.setFillerHeight()
      } else {
        let newUnseenMessage = false
        if (prevProps.messages && prevProps.messages.length > 0) {
          if (this.props.messages.length >= prevProps.messages.length) newUnseenMessage = true
        }
        this.setState({newUnseenMessage})
      }
    }
  }

  setFillerHeight() {
    const container = this.messagesContainer
    const messages = this.messages
    const containerHeight = container.offsetHeight
    const messagesHeight = messages.offsetHeight
    let state = messagesHeight < containerHeight ?
      {fillerHeight: containerHeight - messagesHeight} : {fillerHeight: 20}
    this.setState(state, () => {
      container.scrollTop = Math.max(container.offsetHeight, messages.offsetHeight)
    })
  }

  render() {
    const {loadMoreButton, loading, currentChannelId} = this.props
    const {fillerHeight, newUnseenMessage} = this.state
    return (
      <div>
        {!!loading &&
          <Loading />
        }
        <div
          ref={ref => { this.messagesContainer = ref }}
          style={{
            overflow: 'scroll',
            position: 'absolute',
            width: '100%',
            height: '91%',
            bottom: '50px',
            opacity: !!loading && '0.3'
          }}
          onScroll={
            () => {
              const content = this.content
              const container = this.messagesContainer
              if (scrollIsAtTheBottom(content, container)) this.setState({newUnseenMessage: false})
            }
          }
        >
          <div ref={ref => { this.content = ref }} style={{
            paddingTop: currentChannelId === 2 ? '4.5em' : '0px'
          }}>
            {loadMoreButton ?
              <div
                style={{
                  marginBottom: '2em',
                  textAlign: 'center'
                }}
              >
                <Button
                  className="btn btn-success"
                  style={{width: '20%'}}
                  onClick={this.onLoadMoreButtonClick}
                >Load More</Button>
              </div>
              :
              <div style={{
                height: fillerHeight + 'px'
              }} />
            }
            <div ref={ref => { this.messages = ref }}>
              {this.renderMessages()}
            </div>
          </div>
        </div>
        {!loading && currentChannelId === 2 &&
          <SubjectHeader />
        }
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {newUnseenMessage && <Button
            className="btn btn-warning"
            onClick={
              () => {
                this.setState({newUnseenMessage: false})
                const content = this.content
                const container = this.messagesContainer
                container.scrollTop = Math.max(container.offsetHeight, content.offsetHeight)
              }
            }
          >
            New Message
          </Button>}
        </div>
      </div>
    )
  }

  onLoadMoreButtonClick() {
    const messageId = this.props.messages[0].id
    const channelId = this.props.messages[0].channelId
    const {userId, loadMoreMessages} = this.props
    const {loadMoreButtonLock} = this.state
    if (!loadMoreButtonLock) {
      this.setState({loadMoreButtonLock: true})
      loadMoreMessages(userId, messageId, channelId, () => {
        this.setState({loadMoreButtonLock: false})
      })
    }
  }

  renderMessages() {
    const {messages} = this.props
    return messages.map((message, index) => {
      let {isNotification} = message
      let messageStyle = isNotification ? {color: Color.darkGray} : null
      return <Message key={index} index={index} style={messageStyle} message={message} />
    })
  }
}
