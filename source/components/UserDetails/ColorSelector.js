import React from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';

ColorSelector.propTypes = {
  setColor: PropTypes.func.isRequired,
  statusColor: PropTypes.string
};
export default function ColorSelector({ setColor, statusColor }) {
  const highlightEffects = {
    border: `0.5rem solid #fff`,
    boxShadow: `0 0 5px #fff`
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '60%'
      }}
    >
      <div
        style={{
          width: '3rem',
          height: '3rem',
          marginLeft: '1rem',
          borderRadius: '50%',
          background: Color.pink(),
          cursor: 'pointer',
          ...(statusColor !== 'pink' ? highlightEffects : {})
        }}
        onClick={() => setColor('pink')}
      />
      <div
        style={{
          width: '3rem',
          height: '3rem',
          marginLeft: '1rem',
          borderRadius: '50%',
          cursor: 'pointer',
          background: Color.ivory(),
          ...(statusColor !== 'ivory' ? highlightEffects : {})
        }}
        onClick={() => setColor('ivory')}
      />
      <div
        style={{
          width: '3rem',
          height: '3rem',
          marginLeft: '1rem',
          borderRadius: '50%',
          cursor: 'pointer',
          background: Color.logoGreen(),
          ...(statusColor !== 'logoGreen' ? highlightEffects : {})
        }}
        onClick={() => setColor('logoGreen')}
      />
      <div
        style={{
          width: '3rem',
          height: '3rem',
          marginLeft: '1rem',
          borderRadius: '50%',
          cursor: 'pointer',
          background: Color.logoBlue(),
          ...(statusColor !== 'logoBlue' ? highlightEffects : {})
        }}
        onClick={() => setColor('logoBlue')}
      />
      <div
        style={{
          width: '3rem',
          height: '3rem',
          marginLeft: '1rem',
          borderRadius: '50%',
          cursor: 'pointer',
          background: Color.menuGray(),
          ...(statusColor !== 'menuGray' ? highlightEffects : {})
        }}
        onClick={() => setColor('menuGray')}
      />
    </div>
  );
}
