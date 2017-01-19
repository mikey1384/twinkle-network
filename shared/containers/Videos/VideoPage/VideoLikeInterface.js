import React from 'react';
import Likers from 'components/Likers';
import LikeButton from 'components/LikeButton';

export default function VideoLikeInterface(props) {
  const {userId, likes, onLikeClick, showLikerList, views} = props;
  return (
    <div>
      <div
        className="text-center"
        style={{marginTop: '4em'}}
      >
        {views > 10 &&
          <span
            style={{
              right: '13px',
              fontSize: '1.5em',
              position: 'absolute'
            }}
          >{views} view{`${views > 1 ? 's' : ''}`}</span>
        }
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
