import React from 'react';

const LoadMoreButton = (props) => {
  return (
    <div className="text-center" key="load-more-button">
      <button className="btn btn-default" type="button" onClick={ () => console.log("clicked") }>Load More</button>
    </div>
  )
}

export default LoadMoreButton;
