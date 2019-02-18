import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

ChangePicture.propTypes = {
  shown: PropTypes.bool.isRequired
};

export default function ChangePicture({ shown }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setOpacity(shown ? 1 : 0);
  }, [shown]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50%',
        marginTop: '50%',
        position: 'absolute',
        borderBottomRightRadius: '11rem',
        borderBottomLeftRadius: '11rem',
        transition: 'background 0.5s',
        background: Color.black(Math.max(opacity - 0.3, 0))
      }}
    >
      <div
        style={{
          display: 'flex',
          color: Color.white(opacity),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Icon icon="camera-alt" size="lg" />
        <div style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
          Change Picture
        </div>
      </div>
    </div>
  );
}
