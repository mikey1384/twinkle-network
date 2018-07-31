import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { css } from 'emotion'

LoadMoreButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool
}
export default function LoadMoreButton({ onClick, loading, style, ...props }) {
  return (
    <div
      className={css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Button disabled={loading} onClick={onClick} style={style} {...props}>
        {loading ? 'Loading' : 'Load More'}
        {loading && (
          <Icon style={{ marginLeft: '0.7rem' }} icon="spinner" pulse />
        )}
      </Button>
    </div>
  )
}
