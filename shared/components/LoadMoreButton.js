import React from 'react';
import Button from 'components/Button';

export default function loadMoreButton({onClick, loading}) {
  return (
    <div className="text-center" style={{paddingBottom: '1em'}}>
      <Button
        disabled={loading}
        className="btn btn-success"
        onClick={onClick}
      >
        {loading ? 'Loading...' : 'Load More'}
      </Button>
    </div>
  )
}
