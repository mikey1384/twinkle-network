import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';

Image.propTypes = {
  imageObj: PropTypes.object.isRequired
};

export default function Image({ imageObj }) {
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    init();
    function init() {
      const reader = new FileReader();
      reader.onload = upload => {
        setImageUrl(upload.target.result);
      };
      reader.readAsDataURL(imageObj);
    }
  }, []);

  return (
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
  );
}
