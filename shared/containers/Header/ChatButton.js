import React from 'react';

export default function ChatButton({onClick, chatMode, numUnreads = 0, style = null}) {
  const buttonClass = chatMode ? 'chat-on' : 'chat-off';
  return (
    <button
      className={`btn ${chatMode ? 'btn-warning' : 'btn-default'}`}
      onClick={() => onClick()}
    >
      {`${chatMode ? 'Close Chat' : 'Open Chat'} `}
      {!chatMode && numUnreads > 0 &&
        <span
          className="badge"
          style={{backgroundColor: 'red'}}
          >{numUnreads}
        </span>
      }
    </button>
  )
}
