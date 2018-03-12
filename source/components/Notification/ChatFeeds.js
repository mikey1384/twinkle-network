import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import { timeSince } from 'helpers/timeStampHelpers'
import { connect } from 'react-redux'
import { initChatAsync } from 'redux/actions/ChatActions'
import RoundList from 'components/RoundList'

class ChatFeeds extends Component {
  static propTypes = {
    content: PropTypes.string,
    openChat: PropTypes.func.isRequired,
    reloadedBy: PropTypes.number,
    reloaderName: PropTypes.string,
    reloadTimeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    userId: PropTypes.number,
    username: PropTypes.string
  }

  render() {
    const { content, openChat, style = {} } = this.props
    return (
      <RoundList style={{ ...style, textAlign: 'center' }}>
        <li>
          <h3
            style={{
              fontWeight: 'bold',
              color: Color.logoBlue(),
              marginBottom: '0px'
            }}
          >
            {content}
          </h3>
          {this.renderDetails()}
          <Button
            success
            onClick={() => openChat(2)}
          >
            <span className="glyphicon glyphicon-comment" />&nbsp;Join
            Conversation
          </Button>
        </li>
      </RoundList>
    )
  }

  renderDetails = () => {
    const {
      userId,
      username,
      timeStamp,
      reloadedBy,
      reloaderName,
      reloadTimeStamp
    } = this.props
    const posterString = (
      <Fragment>
        Started by <UsernameText user={{ id: userId, name: username }} />
        {timeStamp ? ` ${timeSince(timeStamp)}` : ''}
      </Fragment>
    )
    const reloaderString = (
      <div style={{ marginTop: '0.5rem' }}>
        Brought back by{' '}
        <UsernameText user={{ id: reloadedBy, name: reloaderName }} />
        {reloadTimeStamp ? ` ${timeSince(reloadTimeStamp)}` : ''}
      </div>
    )

    return (
      <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
        <div>{userId ? posterString : 'Join the conversation!'}</div>
        {reloadedBy && reloaderString}
      </div>
    )
  }
}

export default connect(null, {
  openChat: initChatAsync
})(ChatFeeds)
