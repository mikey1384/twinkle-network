import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

Check.propTypes = {
  checked: PropTypes.bool.isRequired
};

export default function Check({ checked }) {
  return checked ? (
    <Icon icon="check" style={{ color: Color.green() }} />
  ) : (
    <Icon icon="minus" />
  );
}
