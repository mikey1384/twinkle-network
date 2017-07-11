import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import {Color} from 'constants/css'
import moment from 'moment'

Message.propTypes = {
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number,
  content: PropTypes.string,
  isReloadedSubject: PropTypes.number,
  timeStamp: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}
export default function Message({content, userId, username, profilePicId, timeStamp, isReloadedSubject}) {
  return (
    <div
      className="media"
      style={{
        minHeight: '50px',
        height: 'auto',
        width: '100%'
      }}
    >
      <ProfilePic size='4' userId={userId} profilePicId={profilePicId} />
      <div
        className="media-body"
        style={{
          width: '100%',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        <h5 className="media-heading" style={{position: 'absolute'}}>
          <UsernameText
            user={{
              id: userId,
              name: username
            }} /> <small>{moment.unix(timeStamp).format('LLL')}</small>
        </h5>
        <div style={{paddingTop: '1.5em'}}>
          <div>
            <span
              style={{color: isReloadedSubject && Color.green, fontWeight: isReloadedSubject && 'bold'}}
              dangerouslySetInnerHTML={{
                __html: isReloadedSubject ? 'Brought back the subject' : content
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
