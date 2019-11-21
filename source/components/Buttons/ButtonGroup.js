import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';

ButtonGroup.propTypes = {
  buttons: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default function ButtonGroup({ buttons, style }) {
  return (
    <ErrorBoundary style={{ ...style, display: 'flex' }}>
      {buttons.map((button, index) => {
        return (
          <Button
            key={index}
            style={{ marginLeft: index !== 0 && '1rem' }}
            {...button}
            hoverColor={button.hoverColor || button.color}
          >
            {button.label}
          </Button>
        );
      })}
    </ErrorBoundary>
  );
}
