import PropTypes from 'prop-types'
import React from 'react'
import InputForm from 'components/Texts/InputForm'

CommentInputArea.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  inputTypeLabel: PropTypes.string,
  clickListenerState: PropTypes.bool,
  autoFocus: PropTypes.bool,
  style: PropTypes.object
}
export default function CommentInputArea({
  onSubmit,
  inputTypeLabel,
  clickListenerState,
  autoFocus,
  style,
  ...props
}) {
  return (
    <div {...props} style={{ ...style, position: 'relative' }}>
      <InputForm
        clickListenerState={clickListenerState}
        autoFocus={autoFocus}
        onSubmit={onSubmit}
        rows={4}
        placeholder={`Type your ${inputTypeLabel} here...`}
      />
    </div>
  )
}
