import React from 'react';
import GifItem from './GifItem';
import PropTypes from 'prop-types';

GifList.propTypes = {
  data: PropTypes.array
};

export default function GifList({ data }) {
  return (
    <div>
      {data.map((image, index) => {
        <GifItem key={index} gif={image} />;
      })}
    </div>
  );
}
