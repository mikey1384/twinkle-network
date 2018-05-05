import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import { Color } from 'constants/css'
import Button from 'components/Button'
import { addCommasToNumber } from 'helpers/stringHelpers'
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
            <div style={{ fontWeight: 'bold' }}>
              <span>{twinkleXP ? addCommasToNumber(twinkleXP) : 0}</span>
              &nbsp;<span style={{ color: Color.logoBlue() }}>Twin</span>
              <span style={{ color: Color.logoGreen() }}>kle</span>
              &nbsp;<span style={{ color: Color.gold() }}>XP</span>
            </div>
            <Link
              style={{ color: Color.blue(), fontWeight: 'bold' }}
              to="/twinklexp"
            >
              Leaderboard
            </Link>
          </div>
        )}
        {!userId && (
          <div className="login-message">Log in to access all features!</div>
        )}
        {!userId && (
          <Button
            success
            filled
            style={{ marginTop: '1rem' }}
            onClick={openSigninModal}
          >
            Log In | Sign Up
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
