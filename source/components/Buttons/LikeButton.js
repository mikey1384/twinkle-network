import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import { likeContent } from 'helpers/requestHelpers'
import { connect } from 'react-redux'

LikeButton.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  liked: PropTypes.bool.isRequired,
  filled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool,
  style: PropTypes.object,
  targetLabel: PropTypes.string
}
function LikeButton({
  contentId,
  contentType,
  dispatch,
  filled,
  style,
  liked,
  onClick,
  small,
  targetLabel
}) {
  return (
    <Button
      logo={(filled && liked) || !filled}
      info={filled && !liked}
      filled={filled || liked}
      style={style}
      onClick={async() => {
        const likes = await likeContent({
          id: contentId,
          type: contentType,
          dispatch
        })
        onClick(likes, contentId)
      }}
    >
      <span className="glyphicon glyphicon-thumbs-up" />{' '}
      {liked
        ? `${targetLabel ? targetLabel + ' ' : ''}Liked!`
        : `Like${targetLabel ? ' ' + targetLabel : ''}`}
    </Button>
  )
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(LikeButton)
