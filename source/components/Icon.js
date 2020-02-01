import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExecutionEnvironment from 'exenv';

Icon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  size: PropTypes.string
};

export default function Icon({ icon, size, ...props }) {
  return ExecutionEnvironment.canUseDOM ? (
    <FontAwesomeIcon icon={icon} size={size} {...props} />
  ) : null;
}
