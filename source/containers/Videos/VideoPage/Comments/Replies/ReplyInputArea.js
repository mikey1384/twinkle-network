import PropTypes from 'prop-types'
import React from 'react'
import InputForm from 'components/Texts/InputForm'

ReplyInputArea.propTypes = {
  innerRef: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  rows: PropTypes.number,
  style: PropTypes.object
}
export default function ReplyInputArea({
  onSubmit,
  innerRef,
  rows = 1,
  style
}) {
  return (
    <div style={style}>
      <InputForm
        innerRef={innerRef}
        onSubmit={text => onSubmit(text)}
        rows={rows}
        placeholder="Post your reply"
      />
    </div>
  )
}
