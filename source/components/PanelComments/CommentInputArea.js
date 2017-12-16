import PropTypes from 'prop-types'
import React from 'react'
import InputArea from 'components/Texts/InputArea'

CommentInputArea.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  inputTypeLabel: PropTypes.string,
  clickListenerState: PropTypes.bool,
  autoFocus: PropTypes.bool
}
export default function CommentInputArea({
  onSubmit,
  inputTypeLabel,
  clickListenerState,
  autoFocus
}) {
  return (
    <div style={{ paddingTop: '1em' }}>
      <InputArea
        clickListenerState={clickListenerState}
        autoFocus={autoFocus}
        onSubmit={text => onSubmit(text)}
        rows={4}
        placeholder={`Type your ${inputTypeLabel} here...`}
      />
    </div>
  )
}
