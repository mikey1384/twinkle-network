import React from 'react';

export default function ChatButton({onClick, chatMode, numUnreads = 0, style = null}) {
  const buttonClass = chatMode ? 'chat-on' : 'chat-off';
  return (
    <li
      style={style}
    >
      <a
        className={`well unselectable ${buttonClass}`}
        style={{
          padding: '0.7em',
          margin: '0px',
          cursor: 'pointer'
        }}
        onClick={() => onClick()}
      >{`${chatMode ? 'Close Chat' : 'Open Chat'} `}
        {!chatMode && numUnreads > 0 &&
          <span
            className="badge"
            style={{backgroundColor: '#c7322f'}}
            >{numUnreads}
          </span>
        }
      </a>
    </li>
  )
}
