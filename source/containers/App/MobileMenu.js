import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HomeMenuItems from 'components/HomeMenuItems'
import ProfileWidget from 'components/ProfileWidget'
import { Color } from 'constants/css'
import Notification from 'components/Notification'
import { connect } from 'react-redux'
import { logout } from 'redux/actions/UserActions'

class MobileMenu extends Component {
  static propTypes = {
    chatMode: PropTypes.bool,
    location: PropTypes.object,
    logout: PropTypes.func.isRequired,
    history: PropTypes.object,
    username: PropTypes.string,
    onClose: PropTypes.func.isRequired
  }

  state = {
    marginLeft: '-100%'
  }
  componentDidMount() {
    this.setState({ marginLeft: 0 })
  }

  componentDidUpdate(prevProps) {
    const { chatMode, location, onClose } = this.props
    if (location !== prevProps.location) {
      onClose()
    }
    if (chatMode !== prevProps.chatMode) {
      onClose()
    }
  }

  render() {
    const { location, history, logout, username, onClose } = this.props
    const { marginLeft } = this.state
    return (
      <div
        className="mobile"
        css={`
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          position: absolute;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
        `}
      >
        <div
          className="momentum-scroll-enabled"
          css={`
            height: 100%;
            width: 70%;
            position: relative;
            background: ${Color.backgroundGray()};
            margin-left: ${marginLeft};
            transition: margin-left 0.5s;
            overflow-y: scroll;
          `}
        >
          <ProfileWidget history={history} />
          <HomeMenuItems
            history={history}
            location={location}
            style={{ marginTop: '2rem' }}
          />
          <Notification />
          {username && (
            <div
              css={`
                background: #fff;
                width: 100%;
                text-align: center;
                color: ${Color.red()};
                font-size: 3rem;
                padding: 1rem;
              `}
              onClick={logout}
            >
              Log out
            </div>
          )}
        </div>
        <div style={{ width: '30%', position: 'relative' }} onClick={onClose}>
          <span
            className="glyphicon glyphicon-remove"
            style={{
              color: '#fff',
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              fontSize: '4rem',
              opacity: '0.8'
            }}
          />
        </div>
      </div>
    )
  }
}

export default connect(null, { logout })(MobileMenu)
