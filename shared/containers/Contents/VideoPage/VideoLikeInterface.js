import React from 'react';
import Likers from 'components/Likers';

export default function VideoLikeInterface(props) {
  const {userId, likes, onLikeClick, showLikerList} = props;
  return (
    <div>
      <div
        className="text-center"
        style={{marginTop: '4em'}}
      >
        <button
          className="btn btn-info"
          style={{
            fontSize: '3rem'
          }}
          onClick={() => onLikeClick()}
        >
          <span className="glyphicon glyphicon-thumbs-up"></span>
          {renderLikeButtonText(likes)}
        </button>
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

  function renderLikeButtonText(likes) {
    let text = " Like";
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        if(likes[i].userId == userId) text = " Liked!"
      }
    }
    return text;
  }
}
