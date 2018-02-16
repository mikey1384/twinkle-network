import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HomeMenuItems from 'components/HomeMenuItems'
import ProfileWidget from 'components/ProfileWidget'
import { Color } from 'constants/css'
import Notification from 'components/Notification'

export default class MobileMenu extends Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    username: PropTypes.string
  }

  state = {
    marginLeft: '-100%'
  }
  componentDidMount() {
    this.setState({ marginLeft: 0 })
  }
  render() {
    const { location, history, username } = this.props
    const { marginLeft } = this.state
    return (
      <div
        css={`
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          position: absolute;
          z-index: 1000;
        `}
      >
        <div
          css={`
            height: 100%;
            width: 100%;
            position: relative;
            background: ${Color.backgroundGray};
            margin-left: ${marginLeft};
            transition: margin-left 0.5s;
          `}
        >
          <ProfileWidget history={history} />
          <HomeMenuItems
            username={username}
            history={history}
            location={location}
            style={{ marginTop: '2rem' }}
          />
          <Notification />
        </div>
      </div>
    )
  }
}
