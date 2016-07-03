import React from 'react';

export default function ButtonGroup({buttons, style}) {
  return (
    <div
      style={style}
      className='btn-group'
    >
      {buttons.map((button, index) => {
        return (
          <button
            key={index}
            type="button"
            className={`btn ${button.buttonClass}`}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </button>
        )
      })}
    </div>
  )
}
