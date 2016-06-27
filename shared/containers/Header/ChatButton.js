import React from 'react';

export default function ChatButton({onClick, chatMode}) {
  const buttonClass = chatMode ? 'chat-on' : 'chat-off';
  return (
    <li>
      <a
        className={`well unselectable ${buttonClass}`}
        style={{
          padding: '0.7em',
          margin: '0px',
          cursor: 'pointer'
        }}
        onClick={() => onClick()}
      >Messages
      </a>
    </li>
  )
}
