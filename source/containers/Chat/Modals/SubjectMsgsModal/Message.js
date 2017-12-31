import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/Texts/UsernameText'
import { Style } from '../../Style'
import { Color } from 'constants/css'
import moment from 'moment'

Message.propTypes = {
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number,
  content: PropTypes.string,
  isReloadedSubject: PropTypes.number,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
export default function Message({
  content,
  userId,
  username,
  profilePicId,
  timeStamp,
  isReloadedSubject
}) {
  return (
    <div style={Style.container}>
      <div style={Style.profilePicWrapper}>
        <ProfilePic
          style={Style.profilePic}
          userId={userId}
          profilePicId={profilePicId}
        />
      </div>
      <div style={Style.contentWrapper}>
        <div>
          <UsernameText
            style={Style.usernameText}
            user={{
              id: userId,
              name: username
            }}
          />{' '}
          <span style={Style.timeStamp}>
            {moment.unix(timeStamp).format('LLL')}
          </span>
        </div>
        <div>
          <div style={Style.messageWrapper}>
            <span
              style={{
                color: isReloadedSubject && Color.green,
                fontWeight: isReloadedSubject && 'bold'
              }}
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
