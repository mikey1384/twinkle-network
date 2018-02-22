import PropTypes from 'prop-types'
import React from 'react'
import InputForm from 'components/Texts/InputForm'

ReplyInputArea.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  clickListenerState: PropTypes.bool
}
export default function ReplyInputArea({ onSubmit, clickListenerState }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <InputForm
        autoFocus
        clickListenerState={clickListenerState}
        onSubmit={text => onSubmit(text)}
        rows={4}
        placeholder="Post your reply..."
      />
    </div>
  )
}
