import React from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'

Flat.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object
}
export default function Flat({ isLoading, onClick, style }) {
  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        margin: '0',
        height: '3rem',
        cursor: isLoading ? 'default' : 'pointer',
        backgroundColor: Color.green,
        color: '#fff',
        opacity: isLoading && '0.5',
        ...style
      }}
      className="flexbox-container"
      onClick={onClick}
    >
      {isLoading ? 'Loading' : 'Load More'}
      {isLoading && (
        <span>
          &nbsp;&nbsp;<span className="glyphicon glyphicon-refresh spinning" />
        </span>
      )}
    </div>
  )
}
