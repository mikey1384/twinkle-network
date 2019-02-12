import PropTypes from 'prop-types';
import React from 'react';
import InputForm from 'components/Texts/InputForm';

CommentInputArea.propTypes = {
  autoFocus: PropTypes.bool,
  clickListenerState: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  innerRef: PropTypes.func,
  InputFormRef: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  rootCommentId: PropTypes.number,
  targetCommentId: PropTypes.number,
  style: PropTypes.object
};

export default function CommentInputArea({
  onSubmit,
  inputTypeLabel,
  clickListenerState,
  autoFocus,
  innerRef,
  InputFormRef,
  rootCommentId,
  style,
  targetCommentId
}) {
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
