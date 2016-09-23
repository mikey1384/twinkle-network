import React from 'react';
import Button from 'components/Button';
import Likers from 'components/Likers';
import LikeButton from 'components/LikeButton';

export default function VideoLikeInterface(props) {
  const {userId, likes, onLikeClick, showLikerList} = props;
  return (
    <div>
      <div
        className="text-center"
        style={{marginTop: '4em'}}
      >
        <LikeButton
          style={{marginLeft: '0.5em', fontSize: '3rem'}}
          onClick={() => onLikeClick()}
          liked={isLiked(likes)}
        />
      </div>
      <div
        className="text-center"
        style={{marginTop: '1em'}}
      >
        <Likers
          {...props}
          onLinkClick={showLikerList}
          target="video"
        />
      </div>
    </div>
  )

  function isLiked(likes) {
    let liked = false;
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        if(likes[i].userId === userId) liked = true;
      }
    }
    return liked;
  }
}
