import React from 'react';
import InputArea from 'components/InputArea';

export default function CommentInputArea(props) {
  return (
    <div className="page-header">
      <h3>Comments</h3>
      <InputArea
        onSubmit={text => props.onSubmit(text)}
        rows={4}
        placeholder="Post your thoughts here"
      />
    </div>
  )
}
