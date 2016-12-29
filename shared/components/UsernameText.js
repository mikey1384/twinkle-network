import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {openDirectMessage} from 'redux/actions/ChatActions';
import {Color} from 'constants/css';

@connect(
  state => ({
    username: state.UserReducer.username,
    userId: state.UserReducer.userId
  }),
  {openDirectMessage}
)
export default class UsernameText extends Component {
  constructor() {
    super()
    this.state = {
      menuShown: false
    }
    this.onLinkClick = this.onLinkClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
  }

  render() {
    const {menuShown} = this.state;
    const {user, userId, color} = this.props;
    return (
      <span
        className="dropdown"
        onMouseLeave={() => this.setState({menuShown: false})}
      >
        <strong
          style={{
            cursor: 'pointer',
            color: user.name === '(Deleted)' || user.name === null ? Color.darkGray : (color && color)
          }}
          onMouseEnter={this.onMouseEnter}
        >{user.name || '(Deleted)'}</strong>
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
              <a href={`/${user.name}`} target="_blank">
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
    const {user} = this.props;
    if (user.name !== '(Deleted)' && user.name !== null) {
      this.setState({menuShown: true})
    }
  }

  onLinkClick() {
    const {openDirectMessage, user, userId, username} = this.props;
    if (user.id !== userId) {
      openDirectMessage({userId, username}, {userId: user.id, username: user.name})
    }
  }
}
