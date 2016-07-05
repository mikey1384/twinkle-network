import React from 'react';

export default function NavButton({disabled, nextSlide, left, endIndex}) {
  const style = left ?
  {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    msTransform: 'translateY(-50%)'
  } : {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    msTransform: 'translateY(-50%)'
  }

  return(
    <div style={style}>
      <button
        style={getButtonStyles(disabled)}
        onClick={handleClick}>{left ? 'PREV' : 'NEXT'}
      </button>
    </div>
  )

  function getButtonStyles(disabled) {
    return {
      border: 0,
      background: 'rgba(2, 13, 163, 0.77)',
      color: '#fff',
      padding: 10,
      outline: 0,
      opacity: disabled ? 0.3 : 1,
      cursor: 'pointer'
    }
  }

  function handleClick(event) {
    event.preventDefault();
    nextSlide();
  }
}
