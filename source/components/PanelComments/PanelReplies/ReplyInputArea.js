import PropTypes from 'prop-types'
import React from 'react'
import InputArea from 'components/Texts/InputArea'

ReplyInputArea.propTypes = {
  onSubmit: PropTypes.func,
  numReplies: PropTypes.number,
  clickListenerState: PropTypes.bool
}
export default function ReplyInputArea({onSubmit, numReplies, clickListenerState}) {
  return (
    <div className="media" style={{marginTop: numReplies === 0 && '0px'}}>
      <div className="media-body">
        <InputArea
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
