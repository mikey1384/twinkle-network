import React from 'react';

export default function MyReply() {
  return (
    <div
      className="panel panel-default"
      style={{borderTop: '#e7e7e7 1px solid'}}
    >
      <div className="panel-heading">
        <strong>You replied:</strong>
      </div>
      <div className="panel-body">
        <span style={{fontSize: '1.2em'}}>
          My name is mikey
        </span>
      </div>
    </div>
  )
}
