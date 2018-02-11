import PropTypes from 'prop-types'
import React from 'react'
import InputArea from 'components/Texts/InputArea'

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
