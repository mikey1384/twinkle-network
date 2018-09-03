import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InputForm from 'components/Texts/InputForm';

export default class CommentInputArea extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    clickListenerState: PropTypes.bool,
    inputTypeLabel: PropTypes.string,
    innerRef: PropTypes.func,
    InputFormRef: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    rootCommentId: PropTypes.number,
    targetCommentId: PropTypes.number,
    style: PropTypes.object
  };

  render() {
    const {
      onSubmit,
      inputTypeLabel,
      clickListenerState,
      autoFocus,
      innerRef,
      InputFormRef,
      rootCommentId,
      style,
      targetCommentId
    } = this.props;
    return (
      <div style={{ ...style, position: 'relative' }} ref={InputFormRef}>
        <InputForm
          innerRef={innerRef}
          clickListenerState={clickListenerState}
          autoFocus={autoFocus}
          onSubmit={text =>
            onSubmit({ content: text, rootCommentId, targetCommentId })
          }
          rows={4}
          placeholder={`Enter your ${inputTypeLabel} here...`}
        />
      </div>
    );
  }
}
