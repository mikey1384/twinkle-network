import React from 'react';

export default function NavButton({disabled, nextSlide, left, endIndex}) {
  const style = left ?
  {
    position: 'absolute',
    top: '50%',
    left: -10,
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    msTransform: 'translateY(-50%)'
  } : {
    position: 'absolute',
    top: '50%',
    right: -10,
    transform: 'translateY(-50%)',
    WebkitTransform: 'translateY(-50%)',
    msTransform: 'translateY(-50%)'
  }

  return(
    <div style={style}>
      <button
        className="btn btn-default btn-small"
        onClick={handleClick}
        disabled={disabled}
      ><span className={`glyphicon ${left ? 'glyphicon-chevron-left' :'glyphicon-chevron-right'}`} />
      </button>
    </div>
  )

  function handleClick(event) {
    event.preventDefault();
    nextSlide();
  }
}
