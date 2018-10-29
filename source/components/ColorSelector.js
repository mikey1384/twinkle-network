import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

ColorSelector.propTypes = {
  colors: PropTypes.array.isRequired,
  setColor: PropTypes.func.isRequired,
  selectedColor: PropTypes.string,
  style: PropTypes.object
};
export default function ColorSelector({
  colors,
  setColor,
  selectedColor,
  style
}) {
  const highlightEffects = {
    border: `0.5rem solid #fff`,
    boxShadow: `0 0 5px #fff`
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        ...style
      }}
    >
      {colors.map(color => (
        <div
          key={color}
          className={css`
            width: 3rem;
            height: 3rem;
          `}
          style={{
            borderRadius: '50%',
            background: Color[color](),
            cursor: 'pointer',
            ...(selectedColor !== color ? highlightEffects : {})
          }}
          onClick={() => setColor(color)}
        />
      ))}
    </div>
  );
}
