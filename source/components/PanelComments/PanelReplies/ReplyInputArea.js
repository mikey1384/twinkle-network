import PropTypes from 'prop-types'
import React from 'react'
import InputArea from 'components/Texts/InputArea'

ReplyInputArea.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  clickListenerState: PropTypes.bool
}
export default function ReplyInputArea({ onSubmit, clickListenerState }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <InputArea
        autoFocus
        clickListenerState={clickListenerState}
        onSubmit={text => onSubmit(text)}
        rows={4}
        placeholder="Post your reply..."
      />
    </div>
  )
}
