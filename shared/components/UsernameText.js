import React, {Component} from 'react';
import {connect} from 'react-redux';
import {checkChannelExistsAsync, openDirectMessage} from 'redux/actions/ChatActions';

@connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  {
    checkChannelExists: checkChannelExistsAsync,
    openDirectMessage
  }
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
    return (
      <span
        className="dropdown"
        onMouseLeave={() => this.setState({menuShown: false})}
      >
        <strong
          style={{cursor: 'pointer'}}
          onMouseEnter={this.onMouseEnter}
        >{this.props.user.name}</strong>
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
                onClick={this.onLinkClick}
              >
                Message
              </a>
            </li>
          </ul>
        }
      </span>
    )
  }

  onMouseEnter() {
    const {userId, user} = this.props;
    if (Number(user.id) !== Number(userId)) {
      this.setState({menuShown: true})
    }
  }

  onLinkClick() {
    const {openDirectMessage, checkChannelExists, user, userId} = this.props;
    if (Number(user.id) !== Number(userId)) {
      openDirectMessage(user.id, user.name)
    }
  }
}
