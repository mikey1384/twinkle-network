import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InputForm from 'components/Texts/InputForm'

export default class CommentInputArea extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    inputTypeLabel: PropTypes.string,
    innerRef: PropTypes.func,
    InputFormRef: PropTypes.func,
    clickListenerState: PropTypes.bool,
    autoFocus: PropTypes.bool,
    style: PropTypes.object
  }

  render() {
    const {
      onSubmit,
      inputTypeLabel,
      clickListenerState,
      autoFocus,
      innerRef,
      InputFormRef,
      style
    } = this.props
    return (
      <div style={{ ...style, position: 'relative' }} ref={InputFormRef}>
        <InputForm
          innerRef={innerRef}
          clickListenerState={clickListenerState}
          autoFocus={autoFocus}
          onSubmit={text => onSubmit({ content: text })}
          rows={4}
          placeholder={`Enter your ${inputTypeLabel} here...`}
        />
      </div>
    )
  }
}
