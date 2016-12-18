import React from 'react';
import ProfilePic from 'components/ProfilePic';

export default function Header() {
  return (
    <div
      className="panel panel-default"
      style={{borderTop: '#e7e7e7 1px solid'}}
    >
      <div className="panel-body">
        <div
          className="media"
          style={{
            minHeight: '164px',
            height: 'auto',
            width: '100%'
          }}
        >
          <ProfilePic imageSrc="https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/ProfilePics/IMG_0016.JPG" size='10' />
          <div className="media-body" style={{paddingLeft: '1em'}}>
            <h2 className="media-heading">Mikey Lee <small>(mikey)</small></h2>
            <p style={{marginBottom: '0px'}}>Teacher, Programmer, Creator of Twinkle Website</p>
            <p style={{marginBottom: '0px'}}>Likes to learn, teach and create</p>
            <p style={{marginBottom: '0px'}}>Born on January 3, 1984</p>
          </div>
        </div>
      </div>
    </div>
  )
}
