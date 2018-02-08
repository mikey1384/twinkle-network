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
        border: `1px solid ${Color.borderGray}`,
        borderRadius: '4px',
        flexDirection: 'column',
        width: '100%',
        background: '#fff'
      }}
    >
      {username && (
        <div
          style={{
            display: 'flex',
            background: Color.headingGray,
            padding: '3%',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <div style={{ width: '35%' }}>
            <ProfilePic
              style={{
                width: '100%',
                height: '100%',
                cursor: userId ? 'pointer' : 'default'
              }}
              userId={userId}
              profilePicId={profilePicId}
              onClick={() =>
                userId ? history.push(`/users/${username}`) : null
              }
            />
          </div>
          <div style={{ width: '65%', textAlign: 'center' }}>
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '2rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              <Link to={`/users/${username}`}>{username}</Link>
            </div>
            {realName && <div style={{ color: Color.gray, fontSize: '1rem' }}>({realName})</div>}
          </div>
        </div>
      )}
      <div
        style={{
          padding: '5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: '45%'
          }}
        >
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
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Log in to access all features!
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
