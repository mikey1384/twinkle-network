import React from 'react';
import Reply from './Reply';

export default function Replies(props) {
  const {replies, userId, onEditDone, onLikeClick, onDelete} = props;
  return (
    <div
      className="media container-fluid"
      style={{paddingLeft: '0px'}}
    >
      {replies.map(reply => {
        return (
          <Reply
            {...reply}
            onEditDone={onEditDone}
            onLikeClick={onLikeClick}
            onDelete={onDelete}
            myId={userId}
            key={reply.id}
            userIsOwner={reply.userId == userId}
          />
        )
      })}
    </div>
  )
}
