import React, { Component } from 'react';
import Reply from './Reply';


export default class Replies extends Component {
  render() {
    const { replies, userId, onEditDone, onLikeClick, onDelete } = this.props;
    return (
      <div
        className="media container-fluid"
        style={{paddingLeft: '0px'}}
      >
        {
          replies.map(reply => {
            return (
              <Reply
                {...reply}
                onEditDone={onEditDone}
                onLikeClick={onLikeClick}
                onDelete={onDelete}
                userId={userId}
                key={reply.id}
                userIsOwner={reply.userId == userId}
              />
            )
          })
        }
      </div>
    )
  }
}
