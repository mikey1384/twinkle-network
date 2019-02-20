import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';

ChatButton.propTypes = {
  chatMode: PropTypes.bool,
  loading: PropTypes.bool,
  numUnreads: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

export default function ChatButton({
  onClick,
  chatMode,
  loading,
  numUnreads = 0,
  ...props
}) {
  const newMessages = !chatMode && numUnreads > 0;
  return (
    <Button
      {...props}
      transparent={!newMessages}
      default={!newMessages}
      love={newMessages}
      onClick={onClick}
      disabled={loading}
    >
      {!loading && !chatMode && <Icon icon="comments" />}
      {loading && <Icon icon="spinner" pulse />}
      <span style={{ marginLeft: chatMode ? '0.7rem' : '0.8rem' }}>Talk</span>
    </Button>
  );
}
