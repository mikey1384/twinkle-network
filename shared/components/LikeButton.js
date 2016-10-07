import React from 'react';
import Button from 'components/Button';

export default function LikeButton({style, liked, onClick, small}) {
  let buttonStyle = Object.assign({}, style, {
    color: liked ? 'yellow' : '#fff'
  })
  return (
    <Button
      className={`btn btn-${liked ? 'primary' : 'info'}${small ? ' btn-sm' : ''}`}
      style={buttonStyle}
      onClick={onClick}
    >
      <span className="glyphicon glyphicon-thumbs-up"></span> {`${liked ? 'Liked!' : 'Like'}`}
    </Button>
  )
}
