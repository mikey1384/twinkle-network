import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

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
            opacity={button.opacity}
            onClick={button.fds.onClick}
            disabled={button.disabled}
            filled={button.filled}
            hoverClass={button.hoverClass || button.buttonClass}
            onHover={button.onHover}
            {...{ [button.buttonClass]: true }}
          >
            {button.label}
          </Button>
        );
      })}
    </ErrorBoundary>
  );
}
