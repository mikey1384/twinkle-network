import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Color} from 'constants/css'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import {timeSince} from 'helpers/timeStampHelpers'
import {connect} from 'react-redux'
import {initChatAsync} from 'redux/actions/ChatActions'
import {notifyChatSubjectChange} from 'redux/actions/NotiActions'
import {socket} from 'constants/io'

@connect(
  null,
  {
    openChat: initChatAsync,
    notifyChatSubjectChange
  }
)
export default class ChatFeeds extends Component {
  static propTypes = {
    userId: PropTypes.number,
    username: PropTypes.string,
    content: PropTypes.string,
    openChat: PropTypes.func,
    notifyChatSubjectChange: PropTypes.func,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  constructor() {
    super()
    this.onSubjectChange = this.onSubjectChange.bind(this)
  }

  componentDidMount() {
    socket.on('subject_change', this.onSubjectChange)
  }

  componentWillUnmount() {
    socket.removeListener('subject_change', this.onSubjectChange)
  }

  render() {
    const {userId, username, content, timeStamp, openChat} = this.props
    const subtitle = userId ? 'Started by' : 'Join the conversation!'
    return (
      <div style={{textAlign: 'center'}}>
        <h4 style={{marginTop: '0px', fontWeight: 'bold'}}>People are talking about:</h4>
        <ul className="list-group" style={{marginBottom: '0px'}}>
          <li className="list-group-item">
            <p style={{fontWeight: 'bold', color: Color.green, marginBottom: '0px', fontSize: '1.2em'}}>{content}</p>
            <div style={{paddingBottom: '0.5em'}}><small>{subtitle} {userId && <UsernameText user={{id: userId, name: username}} />}{timeStamp ? ` (${timeSince(timeStamp)})` : ''}</small></div>
            <Button className="btn btn-success" onClick={() => openChat(2)}>Join Them!</Button>
          </li>
        </ul>
      </div>
    )
  }

  onSubjectChange(subject) {
    const {notifyChatSubjectChange} = this.props
    notifyChatSubjectChange(subject)
  }
}
