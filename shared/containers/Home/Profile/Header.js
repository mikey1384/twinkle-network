import React from 'react';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';

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
            height: 'auto',
            width: '100%'
          }}
        >
          <ProfilePic
            imageSrc="https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/5/1.PNG" size='13'
          />
          <div className="media-body" style={{paddingLeft: '1em'}}>
            <h2 className="media-heading">mikey <small>(Mikey Lee)</small></h2>
            <p style={{marginBottom: '0px'}}>Teacher, Programmer, Creator of Twinkle Website</p>
            <p style={{marginBottom: '0px'}}>Likes to learn, teach and create</p>
            <p style={{marginBottom: '0px'}}>Born on January 3, 1984</p>
            <Button className="btn btn-sm btn-default" style={{marginTop: '0.5em'}}>Edit Bio</Button><br/>
            <Button className="btn btn-sm btn-default" style={{marginTop: '0.5em'}}>Change Profile Picture</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
