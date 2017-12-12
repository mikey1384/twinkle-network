import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Color} from 'constants/css'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import {timeSince} from 'helpers/timeStampHelpers'
import {connect} from 'react-redux'
import {initChatAsync} from 'redux/actions/ChatActions'

class ChatFeeds extends Component {
  static propTypes = {
    content: PropTypes.string,
    openChat: PropTypes.func.isRequired,
    reloadedBy: PropTypes.number,
    reloaderName: PropTypes.string,
    reloadTimeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    userId: PropTypes.number,
    username: PropTypes.string
  }

  render() {
    const {content, openChat} = this.props
    return (
      <div style={{textAlign: 'center'}}>
        <h4 style={{marginTop: '0px', fontWeight: 'bold'}}>People are talking about:</h4>
        <ul className="list-group" style={{marginBottom: '0px'}}>
          <li className="list-group-item">
            <p style={{fontWeight: 'bold', color: Color.green, marginBottom: '0px', fontSize: '1.2em'}}>{content}</p>
            {this.renderDetails()}
            <Button className="btn btn-success" onClick={() => openChat(2)}>Join Them!</Button>
          </li>
        </ul>
      </div>
    )
  }

  renderDetails = () => {
    const {userId, username, timeStamp, reloadedBy, reloaderName, reloadTimeStamp} = this.props
    const posterString = <span>
      Started by <UsernameText user={{id: userId, name: username}} />
      {timeStamp ? ` ${timeSince(timeStamp)}` : ''}
    </span>
    const reloaderString = <div>
      <small>
        Brought back by <UsernameText user={{id: reloadedBy, name: reloaderName}} />
        {reloadTimeStamp ? ` ${timeSince(reloadTimeStamp)}` : ''}
      </small>
    </div>

    return (
      <div style={{paddingBottom: '0.5em'}}>
        <div><small>{userId ? posterString : 'Join the conversation!'}</small></div>
        {reloadedBy && reloaderString}
      </div>
    )
  }
}

export default connect(
  null,
  {
    openChat: initChatAsync
  }
)(ChatFeeds)
