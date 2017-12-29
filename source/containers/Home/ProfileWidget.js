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
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: '3%',
        background: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ width: '45%' }}>
        <ProfilePic
          style={{
            width: '100%',
            height: '100%',
            cursor: userId ? 'pointer' : 'default'
          }}
          userId={userId}
          profilePicId={profilePicId}
          onClick={() => (userId ? history.push(`/users/${username}`) : null)}
        />
      </div>
      <div
        style={{
          width: '45%'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: username ? '3rem' : '2rem',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
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
          <div>
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
