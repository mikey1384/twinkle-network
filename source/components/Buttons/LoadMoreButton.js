import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { css } from 'emotion';

LoadMoreButton.propTypes = {
  label: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
export default function LoadMoreButton({
  label,
  onClick,
  loading,
  style,
  ...props
}) {
  return (
    <div
      className={css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Button disabled={loading} onClick={onClick} style={style} {...props}>
        {loading ? 'Loading' : label || 'Load More'}
        {loading && (
          <Icon style={{ marginLeft: '0.7rem' }} icon="spinner" pulse />
        )}
      </Button>
    </div>
  );
}
