import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {openDirectMessageChannel} from 'redux/actions/ChatActions'
import {Color} from 'constants/css'

@connect(
  state => ({
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    chatMode: state.ChatReducer.chatMode
  }),
  {openDirectMessageChannel}
)
export default class UsernameText extends Component {
  static propTypes = {
    user: PropTypes.object,
    userId: PropTypes.number,
    color: PropTypes.string,
    openDirectMessageChannel: PropTypes.func,
    username: PropTypes.string,
    chatMode: PropTypes.bool
  }

  constructor() {
    super()
    this.state = {
      menuShown: false
    }
    this.onLinkClick = this.onLinkClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
  }

  render() {
    const {menuShown} = this.state
    const {user, userId, color} = this.props
    return (
      <span
        className="dropdown"
        onMouseLeave={() => this.setState({menuShown: false})}
      >
        <b
          style={{
            cursor: 'pointer',
            color: user.name ? (color && color) : Color.darkGray
          }}
          onMouseEnter={this.onMouseEnter}
        >
          {user.name || '(Deleted)'}
        </b>
        {menuShown &&
          <ul className="dropdown-menu"
            style={{
              position: 'absolute',
              marginTop: '0px',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            <li>
              <a
                href={`/users/${user.name}`}
                target="_blank"
              >
                Profile
              </a>
              {user.id !== userId &&
                <a onClick={this.onLinkClick}>
                  Message
                </a>
              }
            </li>
          </ul>
        }
      </span>
    )
  }

  onMouseEnter() {
    const {user} = this.props
    if (user.name) this.setState({menuShown: true})
  }

  onLinkClick() {
    const {openDirectMessageChannel, user, userId, username, chatMode} = this.props
    this.setState({menuShown: false})
    if (user.id !== userId) {
      openDirectMessageChannel({userId, username}, {userId: user.id, username: user.name}, chatMode)
    }
  }
}
