import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import { Color } from 'constants/css'
import Button from 'components/Button'
import { openSigninModal } from 'redux/actions/UserActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

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
    <div
      style={{
        paddingTop: '1em',
        paddingBottom: '1em',
        backgroundColor: '#fff'
      }}
    >
      <div className="col-xs-5" style={{ float: 'left' }}>
        <ProfilePic
          size="8"
          userId={userId}
          profilePicId={profilePicId}
          style={{ cursor: userId ? 'pointer' : 'default' }}
          onClick={() => (userId ? history.push(`/users/${username}`) : null)}
        />
      </div>
      <div className="col-xs-7">
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '1.5em'
          }}
        >
          {username ? (
            <Link to={`/users/${username}`}>{username}</Link>
          ) : (
            'Log in to access all features!'
          )}
        </div>
        {realName && <div style={{ color: Color.gray }}>({realName})</div>}
        {userId && (
          <div style={{ marginTop: '0.5em' }}>
            <div style={{ fontWeight: 'bold' }}>
              <span>{twinkleXP || 0}</span>
              &nbsp;<span style={{ color: Color.logoGreen }}>Twin</span>
              <span style={{ color: Color.logoBlue }}>kle</span>
              &nbsp;<span style={{ color: Color.orange }}>XP</span>
            </div>
            <Link to="/twinklexp">Leaderboard</Link>
          </div>
        )}
        {!userId && (
          <Button
            className="btn btn-success"
            style={{ marginTop: '1em' }}
            onClick={openSigninModal}
          >
            Log In / Sign Up
          </Button>
        )}
      </div>
      <div className="clearfix" />
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
