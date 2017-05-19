import PropTypes from 'prop-types'
import React from 'react'
import Likers from 'components/Likers'
import LikeButton from 'components/LikeButton'

VideoLikeInterface.propTypes = {
  userId: PropTypes.number,
  likes: PropTypes.array,
  onLikeClick: PropTypes.func,
  showLikerList: PropTypes.func,
  className: PropTypes.string
}
export default function VideoLikeInterface({userId, likes, onLikeClick, showLikerList, className}) {
  return (
    <div className="pull-right">
      <div style={{textAlign: 'center'}}>
        <LikeButton
          style={{fontSize: '3rem'}}
          onClick={() => onLikeClick()}
          liked={isLiked(likes)}
        />
        <div style={{marginTop: '0.5em'}}>
          <Likers
            userId={userId}
            likes={likes}
            onLinkClick={showLikerList}
            target="video"
            defaultText="Be the first to like this video"
          />
        </div>
      </div>
    </div>
  )

  function isLiked(likes) {
    let liked = false
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].userId === userId) liked = true
      }
    }
    return liked
  }
}
