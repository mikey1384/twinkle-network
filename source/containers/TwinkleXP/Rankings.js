import React from 'react'
import Styles from './Styles'
import ProfilePic from 'components/ProfilePic'

export default function Rankings() {
  return (
    <div
      className="col-xs-offset-8"
      style={Styles.rightMenu}
    >
      <p style={{...Styles.subHeader, textAlign: 'center'}}>
        Rankings
      </p>
      <div
        className="media"
      >
        <div className="media-left media-middle">
          <ProfilePic size='4' userId={5} profilePicId={25} />
        </div>
        <div className="media-body">
          <p style={{fontSize: '1.2em'}} className="media-heading">Some random string</p>
        </div>
      </div>
    </div>
  )
}
