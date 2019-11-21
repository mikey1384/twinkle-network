import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import { Color } from 'constants/css';

Image.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

export default function Image({ imageUrl }) {
  return imageUrl ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: Color.black()
      }}
    >
      <img
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        src={imageUrl}
        rel=""
      />
    </div>
  ) : (
    <Loading />
  );
}
