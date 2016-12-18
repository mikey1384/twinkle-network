import React from 'react';
import Button from 'components/Button';

export default function ProfilePic({size, imageSrc, editable}) {
  return (
    <div className="media-left">
      <a>
        <img className="media-object" style={{width: `${size}vw`, height: `${size}vw`}} src={imageSrc ? imageSrc : "/img/default.jpg"}/>
      </a>
    </div>
  )
}
