import React from 'react';
import InputArea from 'components/InputArea';

export default function ReplyInputArea({onSubmit, clickListenerState}) {
  return (
    <div className="media">
      <div className="media-body">
        <InputArea
          autoFocus
          clickListenerState={clickListenerState}
          onSubmit={text => onSubmit(text)}
          rows={4}
          placeholder="Post your reply"
        />
      </div>
    </div>
  )
}
