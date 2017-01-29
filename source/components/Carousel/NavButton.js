import React, {PropTypes} from 'react'
import Button from 'components/Button'

NavButton.propTypes = {
  disabled: PropTypes.bool,
  nextSlide: PropTypes.func,
  left: PropTypes.bool
}

export default function NavButton({disabled, nextSlide, left}) {
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

  return (
    <div style={style}>
      <Button
        className="btn btn-default btn-small"
        onClick={handleClick}
        disabled={disabled}
      >
        <span className={`glyphicon ${left ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right'}`} />
      </Button>
    </div>
  )

  function handleClick(event) {
    event.preventDefault()
    nextSlide()
  }
}
