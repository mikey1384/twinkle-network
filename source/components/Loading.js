import PropTypes from 'prop-types'
import React from 'react'
import Spinner from 'components/Spinner'
import { css } from 'emotion'

Loading.propTypes = {
  relative: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string
}
export default function Loading({
  relative,
  className,
  text = '',
  style = {}
}) {
  return (
    <div
      className={`${css`
        width: 100%;
        height: 15rem;
      `} ${className}`}
      style={style}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2.8rem'
        }}
      >
        <Spinner />
        {text && <div style={{ marginLeft: '1.5rem' }}>{text}</div>}
      </div>
    </div>
  )
}
