import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'

LikeButton.propTypes = {
  liked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool,
  style: PropTypes.object,
  targetLabel: PropTypes.string
}
export default function LikeButton({
  style,
  liked,
  onClick,
  small,
  targetLabel
}) {
  return (
    <Button
      className={`btn btn-${liked ? 'primary' : 'info'}${
        small ? ' btn-sm' : ''
      }`}
      style={style}
      onClick={onClick}
    >
      <span className="glyphicon glyphicon-thumbs-up" />{' '}
      {liked
        ? `${targetLabel ? targetLabel + ' ' : ''}Liked!`
        : `Like${targetLabel ? ' ' + targetLabel : ''}`}
    </Button>
  )
}
