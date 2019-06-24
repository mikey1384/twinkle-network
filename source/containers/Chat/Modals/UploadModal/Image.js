import React from 'react';
import PropTypes from 'prop-types';

Image.propTypes = {
  imageObj: PropTypes.object.isRequired
};

export default function Image({ imageObj }) {
  console.log(imageObj.name);
  return (
    <div>
      <div>image</div>
    </div>
  );
}
