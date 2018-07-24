import PropTypes from 'prop-types'
import React from 'react'
import Spinner from 'components/Spinner'
import { css } from 'emotion'

Loading.propTypes = {
  absolute: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string
}
export default function Loading({
  absolute,
  className,
  text = '',
  style = {}
}) {
  const loadingStyle = absolute
    ? css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      `
    : css`
        width: 100%;
        height: 20rem;
      `
  return (
    <div className={`${loadingStyle} ${className}`} style={style}>
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
