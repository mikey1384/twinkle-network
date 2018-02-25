import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import ExecutionEnvironment from 'exenv'

Icon.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.string
}
export default function Icon({ icon, size }) {
  return ExecutionEnvironment.canUseDOM ? (
    <FontAwesomeIcon icon={icon} size={size} />
  ) : null
}
