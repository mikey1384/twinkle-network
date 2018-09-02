import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openDirectMessageChannel } from 'redux/actions/ChatActions'
import DropdownList from 'components/DropdownList'
import { Color } from 'constants/css'

class UsernameText extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    openDirectMessageChannel: PropTypes.func.isRequired,
    user: PropTypes.object,
    userId: PropTypes.number,
    username: PropTypes.string
  }

  state = {
    menuShown: false
  }

  render() {
    const { user = {}, userId, color, className, style = {} } = this.props
    const { menuShown } = this.state
    return (
      <div
        style={{ display: 'inline', position: 'relative' }}
        onMouseLeave={() => this.setState({ menuShown: false })}
      >
        <span
          className={className}
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            color: user.username
              ? color || Color.darkGray()
              : Color.lightGray(),
            ...style
          }}
          onClick={this.onUsernameClick}
          onMouseEnter={this.onMouseEnter}
        >
          {user.username || '(Deleted)'}
        </span>
        {menuShown && (
          <DropdownList style={{ width: '100%' }}>
            <li onClick={() => window.open(`/users/${user.username}`)}>
              <a
                href={`/users/${user.username}`}
                style={{ color: Color.darkGray() }}
                onClick={e => e.preventDefault()}
              >
                Profile
              </a>
            </li>
            {user.id !== userId && (
              <li onClick={this.onLinkClick}>
                <a style={{ color: Color.darkGray() }}>Talk</a>
              </li>
            )}
          </DropdownList>
        )}
      </div>
    )
  }

  onMouseEnter = () => {
    const { user } = this.props
    if (user.username) this.setState({ menuShown: true })
  }

  onLinkClick = () => {
    const {
      openDirectMessageChannel,
      user,
      userId,
      username,
      chatMode
    } = this.props
    this.setState({ menuShown: false })
    if (user.id !== userId) {
      openDirectMessageChannel(
        { userId, username },
        { userId: user.id, username: user.username },
        chatMode
      )
    }
  }

  onUsernameClick = () => {
    const { user } = this.props
    if (user.username) {
      this.setState(state => ({
        menuShown: !state.menuShown
      }))
    }
  }
}

export default connect(
  state => ({
    chatMode: state.ChatReducer.chatMode,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId
  }),
  { openDirectMessageChannel }
)(UsernameText)
