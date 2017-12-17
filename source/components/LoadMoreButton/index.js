import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'

LoadMoreButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool
}
export default function LoadMoreButton({ onClick, loading, style }) {
  return (
    <div className="text-center" style={style}>
      <Button disabled={loading} className="btn btn-success" onClick={onClick}>
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
