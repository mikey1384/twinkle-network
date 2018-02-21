import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import { Color } from 'constants/css'
import Button from 'components/Button'
import { openSigninModal } from 'redux/actions/UserActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { container } from './Styles'

ProfileWidget.propTypes = {
  history: PropTypes.object,
  openSigninModal: PropTypes.func,
  profilePicId: PropTypes.number,
  realName: PropTypes.string,
  twinkleXP: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string
}
function ProfileWidget({
  history,
  openSigninModal,
  twinkleXP,
  userId,
  username,
  profilePicId,
  realName
}) {
  return (
    <div className={container}>
      {username && (
        <div className="heading">
          <div className="profile-pic">
            <ProfilePic
              style={{
                width: '90%',
                height: '90%',
                cursor: userId ? 'pointer' : 'default'
              }}
              userId={userId}
              profilePicId={profilePicId}
              onClick={() => {
                if (userId) history.push(`/users/${username}`)
              }}
            />
          </div>
          <div className="names">
            <div>
              <Link to={`/users/${username}`}>{username}</Link>
            </div>
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
            <div style={{ fontWeight: 'bold' }}>
              <span>{twinkleXP || 0}</span>
              &nbsp;<span style={{ color: Color.logoBlue() }}>Twin</span>
              <span style={{ color: Color.logoGreen() }}>kle</span>
              &nbsp;<span style={{ color: Color.gold() }}>XP</span>
            </div>
            <Link to="/twinklexp">Leaderboard</Link>
          </div>
        )}
        {!userId && (
          <div className="login-message">Log in to access all features!</div>
        )}
        {!userId && (
          <Button
            className="btn btn-success"
            style={{ marginTop: '2rem' }}
            onClick={openSigninModal}
          >
            Log In / Sign Up
          </Button>
        )}
      </div>
    </div>
  )
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
