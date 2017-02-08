import React, {PropTypes} from 'react'
import Button from 'components/Button'

LoadMoreButton.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool
}
export default function LoadMoreButton({onClick, loading}) {
  return (
    <div className="text-center" style={{paddingBottom: '1em'}}>
      <Button
        disabled={loading}
        className="btn btn-success"
        onClick={onClick}
      >
        {loading ? 'Loading' : 'Load More'}
        {loading && <span>&nbsp;&nbsp;<span className="glyphicon glyphicon-refresh spinning"></span></span>}
      </Button>
    </div>
  )
}
