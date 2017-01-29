import React, {PropTypes} from 'react'
import Button from 'components/Button'

LikeButton.propTypes = {
  style: PropTypes.object,
  liked: PropTypes.bool,
  onClick: PropTypes.func,
  small: PropTypes.bool,
  targetLabel: PropTypes.string
}
export default function LikeButton({style, liked, onClick, small, targetLabel}) {
  return (
    <Button
      className={`btn btn-${liked ? 'primary' : 'info'}${small ? ' btn-sm' : ''}`}
      style={style}
      onClick={onClick}
    >
      <span className="glyphicon glyphicon-thumbs-up"></span> {liked ? `${targetLabel ? targetLabel + ' ' : ''}Liked!` : `Like${targetLabel ? ' ' + targetLabel : ''}`}
    </Button>
  )
}
