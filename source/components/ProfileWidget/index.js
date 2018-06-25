/* global FileReader */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import { openSigninModal } from 'redux/actions/UserActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { container } from './Styles'
import { Color } from 'constants/css'

class ProfileWidget extends Component {
  static propTypes = {
    history: PropTypes.object,
    loadImage: PropTypes.func,
    openSigninModal: PropTypes.func,
    profilePicId: PropTypes.number,
    realName: PropTypes.string,
    showAlert: PropTypes.func,
    userId: PropTypes.number,
    username: PropTypes.string
  }

  render() {
    const {
      history,
      openSigninModal,
      userId,
      username,
      profilePicId,
      realName
    } = this.props
    return (
      <div
        className={container({
          headingGray: Color.headingGray(),
          borderGray: Color.borderGray(),
          blue: Color.blue(),
          darkGray: Color.darkGray()
        })}
      >
        {username && (
          <div className="heading">
            <ProfilePic
              className="widget__profile-pic"
              style={{
                cursor: userId ? 'pointer' : 'default'
              }}
              userId={userId}
              profilePicId={profilePicId}
              onClick={() => {
                if (userId) history.push(`/users/${username}`)
              }}
            />
            <div className="names">
              <Link to={`/users/${username}`}>{username}</Link>
              {realName && (
                <div>
                  <span>({realName})</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="details">
          {userId && (
            <div>
              <Button
                transparent
                onClick={() => history.push(`/users/${username}`)}
              >
                My Profile
              </Button>
              <Button transparent onClick={() => this.fileInput.click()}>
                Change Picture
              </Button>
            </div>
          )}
          {!userId && (
            <div className="login-message">Log in to access all features</div>
          )}
          {!userId && (
            <Button
              success
              filled
              style={{ marginTop: '1rem' }}
              onClick={openSigninModal}
            >
              Tap here!
            </Button>
          )}
          <input
            ref={ref => {
              this.fileInput = ref
            }}
            style={{ display: 'none' }}
            type="file"
            onChange={this.handlePicture}
            accept="image/*"
          />
        </div>
      </div>
    )
  }

  handlePicture = event => {
    const { loadImage, showAlert } = this.props
    const reader = new FileReader()
    const maxSize = 5000
    const file = event.target.files[0]
    if (file.size / 1000 > maxSize) {
      return showAlert()
    }
    reader.onload = loadImage
    reader.readAsDataURL(file)
    event.target.value = null
  }
}

export default connect(
  state => ({
    realName: state.UserReducer.realName,
    twinkleXP: state.UserReducer.twinkleXP,
    username: state.UserReducer.username,
    userId: state.UserReducer.userId,
    profilePicId: state.UserReducer.profilePicId
  }),
  { openSigninModal }
)(ProfileWidget)
