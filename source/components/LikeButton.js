import React from 'react';
import Button from 'components/Button';

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
