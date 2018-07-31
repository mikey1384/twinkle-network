import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import Icon from 'components/Icon'
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
        opacity: 0.9;
        top: 7rem;
        ${left ? 'left: -0.5rem;' : 'right: -0.5rem;'};
      `}
      snow
      onClick={handleClick}
    >
      <Icon icon={left ? 'chevron-left' : 'chevron-right'} />
    </Button>
  )

  function handleClick(event) {
    event.preventDefault()
    nextSlide()
  }
}
