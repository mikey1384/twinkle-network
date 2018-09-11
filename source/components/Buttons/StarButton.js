import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';

StarButton.propTypes = {
  isStarred: PropTypes.bool,
  onClick: PropTypes.func
};
export default function StarButton({ isStarred, onClick, ...props }) {
  return (
    <div {...props}>
      <Button love filled={isStarred} onClick={onClick}>
        <Icon icon="star" />
      </Button>
    </div>
  );
}
