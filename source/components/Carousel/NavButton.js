import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import { css } from 'emotion'

NavButton.propTypes = {
  disabled: PropTypes.bool,
  nextSlide: PropTypes.func,
  left: PropTypes.bool
}

export default function NavButton({ disabled, nextSlide, left }) {
  return disabled ? null : (
    <Button
      className={css`
        position: absolute;
        ${left ? 'left: -1.5rem;' : 'right: -1.5rem;'} top: 4.5rem;
      `}
      snow
      onClick={handleClick}
    >
      <span
        className={`glyphicon ${
          left ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right'
        }`}
      />
    </Button>
  )

  function handleClick(event) {
    event.preventDefault()
    nextSlide()
  }
}
