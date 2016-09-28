import React from 'react';
import InputArea from 'components/InputArea';

export default function ReplyInputArea(props) {
  return (
    <div className="media">
      <div className="media-body">
        <InputArea
          autoFocus
          onSubmit={text => props.onSubmit(text)}
          rows={4}
          placeholder="Post your reply"
        />
      </div>
    </div>
  )
}
