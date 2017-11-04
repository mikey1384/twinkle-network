import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'

ProfileWidget.propTypes = {
  history: PropTypes.object,
  myUsername: PropTypes.string,
  profilePicId: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string
}
export default function ProfileWidget({history, userId, username, myUsername, profilePicId}) {
  return (
    <div
      className={`list-group-item left-menu-item home-left-menu ${username === myUsername && ' active'} flexbox-container`}
      onClick={() => history.push(`/users/${myUsername}`)}
    >
      <ProfilePic size='3' userId={userId} profilePicId={profilePicId} /><a>Profile</a>
      <div className="clearfix"></div>
    </div>
  )
}

