import React from 'react';
import InputArea from 'components/InputArea';

export default function ReplyInputArea({onSubmit, numReplies, clickListenerState}) {
  return (
    <div className="media" style={{marginTop: numReplies === 0 && '0px'}}>
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
