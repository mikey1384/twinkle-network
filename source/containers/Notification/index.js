import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addEvent, removeEvent} from 'helpers/listenerHelpers'
import NotiFeeds from './NotiFeeds'
import ChatFeeds from './ChatFeeds'
import {defaultChatSubject} from 'constants/defaultValues'
import Responsive from 'components/Wrappers/Responsive'

class Notification extends Component {
  static propTypes = {
    chatMode: PropTypes.bool.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    currentChatSubject: PropTypes.object,
    device: PropTypes.string.isRequired,
    myId: PropTypes.number,
    notifications: PropTypes.array.isRequired,
    position: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      scrollPosition: window.scrollY,
      scrollLocked: false
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onPageScroll = this.onPageScroll.bind(this)
  }

  componentDidMount() {
    addEvent(window, 'mousemove', this.onMouseMove)
    addEvent(window, 'scroll', this.onPageScroll)
  }

  componentWillUnmount() {
    removeEvent(window, 'mousemove', this.onMouseMove)
    removeEvent(window, 'scroll', this.onPageScroll)
  }

  render() {
    const {
      notifications, myId, className, device, position = 'fixed',
      currentChatSubject: {
        content = defaultChatSubject, loaded, ...subject
      },
      children
    } = this.props
    return (
      <div
        className={className}
        style={{position}}
      >
        <Responsive device={device}>
          <div>
            {children &&
              <div style={{minHeight: '3em', marginBottom: '1em'}}>
                {children}
              </div>
            }
            <div
              className="well momentum-scroll-enabled"
              onScroll={this.handleScroll}
              style={{maxHeight: '35em'}}
              ref={ref => { this.NotificationBox = ref }}
            >
              {loaded && <ChatFeeds content={content} {...subject} />}
              {notifications.length > 0 && <NotiFeeds notifications={notifications} myId={myId} style={{marginTop: loaded && '1.5em'}} />}
            </div>
          </div>
        </Responsive>
      </div>
    )
  }

  handleScroll() {
    const {device} = this.props
    const {scrollHeight, clientHeight, scrollTop} = this.NotificationBox
    if (device === 'desktop') {
      if (scrollTop === 0 || scrollHeight - clientHeight === scrollTop) {
        this.setState({scrollLocked: true})
      } else {
        this.setState({scrollLocked: false})
      }
    }
  }

  onMouseMove() {
    const {scrollLocked} = this.state
    if (scrollLocked) this.setState({scrollLocked: false})
  }

  onPageScroll() {
    const {chatMode} = this.props
    const {scrollLocked} = this.state
    if (scrollLocked) {
      window.scrollTo(0, this.state.scrollPosition)
    }
    if (!chatMode) {
      this.setState({scrollPosition: window.scrollY})
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    myId: state.UserReducer.userId,
    notifications: state.NotiReducer.notifications,
    currentChatSubject: state.NotiReducer.currentChatSubject
  })
)(Notification)
