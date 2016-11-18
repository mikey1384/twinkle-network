import React from 'react';
import InputArea from 'components/InputArea';

export default function CommentInputArea({onSubmit, inputTypeLabel}) {
  return (
    <div style={{paddingTop: '1em'}}>
      <InputArea
        autoFocus
        onSubmit={text => onSubmit(text)}
        rows={4}
        placeholder={`Write a ${inputTypeLabel}...`}
      />
    </div>
  )
}
