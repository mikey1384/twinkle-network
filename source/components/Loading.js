import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'emotion'

Loading.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string
}
export default function Loading({ text = '', style = {} }) {
  return (
    <div
      className={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
      style={style}
    >
      <div>
        <span className="glyphicon glyphicon-refresh spinning" />&nbsp;
        {text}
      </div>
    </div>
  )
}
