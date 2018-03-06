import PropTypes from 'prop-types'
import React from 'react'
import InputForm from 'components/Texts/InputForm'

ReplyInputArea.propTypes = {
  clickListenerState: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  style: PropTypes.object
}
export default function ReplyInputArea({
  onSubmit,
  clickListenerState,
  style
}) {
  return (
    <div style={style}>
      <div className="media-body">
        <InputForm
          autoFocus
          clickListenerState={clickListenerState}
          onSubmit={text => onSubmit(text)}
          rows={4}
          placeholder="Post your reply"
        />
      </div>
    </div>
  )
}
