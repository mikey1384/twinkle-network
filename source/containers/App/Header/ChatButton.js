import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'

ChatButton.propTypes = {
  chatMode: PropTypes.bool,
  loading: PropTypes.bool,
  numUnreads: PropTypes.number,
  onClick: PropTypes.func.isRequired
}
export default function ChatButton({
  onClick,
  chatMode,
  loading,
  numUnreads = 0,
  ...props
}) {
  const newMessages = !chatMode && numUnreads > 0
  return (
    <Button
      {...props}
      transparent={!newMessages}
      love={newMessages}
      onClick={onClick}
      disabled={loading}
    >
      {!loading &&
        !chatMode && (
          <span>
            <span className="glyphicon glyphicon-comment" />&nbsp;
          </span>
        )}
      {loading && (
        <span>
          <span className="glyphicon glyphicon-refresh spinning" />&nbsp;
        </span>
      )}
      {chatMode && (
        <span>
          <span className="glyphicon glyphicon-remove" />&nbsp;
        </span>
      )}
      {`${chatMode ? 'Close' : ' Talk'} `}
    </Button>
  )
}
