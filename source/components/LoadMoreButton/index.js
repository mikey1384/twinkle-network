import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import { css } from 'emotion'

LoadMoreButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool
}
export default function LoadMoreButton({ onClick, loading, style }) {
  return (
    <div
      className={css`
        text-align: center;
      `}
      style={style}
    >
      <Button disabled={loading} info filled onClick={onClick}>
        {loading ? 'Loading' : 'Load More'}
        {loading && (
          <span>
            &nbsp;&nbsp;<span className="glyphicon glyphicon-refresh spinning" />
          </span>
        )}
      </Button>
    </div>
  )
}
