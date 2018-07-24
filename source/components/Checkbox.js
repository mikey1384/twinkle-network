import React from 'react'
import PropTypes from 'prop-types'
import { innerBorderRadius, Color } from 'constants/css'
import { css } from 'emotion'

Checkbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired
}
export default function Checkbox({ checked, label, onClick }) {
  return (
    <div
      style={{
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        postion: 'relative',
        width: '100%'
      }}
    >
      {label && (
        <span style={{ fontSize: '1.2rem', color: Color.darkGray() }}>
          {label}&nbsp;&nbsp;
        </span>
      )}
      <div
        onClick={onClick}
        style={{
          borderRadius: innerBorderRadius,
          border: `1px solid ${Color.borderGray()}`,
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: checked ? Color.logoBlue() : Color.wellGray()
        }}
      >
        {checked && (
          <div
            className={css`
              display: inline-block;
              width: 0.6rem;
              height: 1rem;
              margin-top: 2%;
              border: solid #fff;
              border-width: 0 3px 3px 0;
              transform: rotate(45deg);
            `}
          />
        )}
      </div>
    </div>
  )
}
