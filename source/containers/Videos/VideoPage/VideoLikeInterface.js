import PropTypes from 'prop-types'
import React from 'react'
import Likers from 'components/Likers'
import LikeButton from 'components/LikeButton'
import StarButton from 'components/StarButton'
import {starVideo} from 'redux/actions/VideoActions'
import {connect} from 'react-redux'

VideoLikeInterface.propTypes = {
  className: PropTypes.string,
  isCreator: PropTypes.bool.isRequired,
  isStarred: PropTypes.bool,
  likes: PropTypes.array.isRequired,
  onLikeClick: PropTypes.func.isRequired,
  showLikerList: PropTypes.func.isRequired,
  starVideo: PropTypes.func.isRequired,
  userId: PropTypes.number,
  videoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
}
function VideoLikeInterface({
  userId, isCreator, isStarred, likes, onLikeClick,
  showLikerList, starVideo, className, videoId
}) {
  return (
    <div className="pull-right">
      <div style={{textAlign: 'center'}}>
        <LikeButton
          style={{fontSize: isCreator ? '2rem' : '3rem'}}
          onClick={onLikeClick}
          liked={isLiked(likes)}
        />
        {isCreator && <StarButton
          isStarred={isStarred}
          onClick={() => starVideo(videoId)}
          style={{
            fontSize: '2rem',
            marginLeft: '1rem'
          }}
        />}
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

export default connect(
  state => ({
    isCreator: state.UserReducer.isCreator
  }),
  {starVideo}
)(VideoLikeInterface)
