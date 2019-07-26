import PropTypes from 'prop-types';
import React from 'react';
import InputForm from 'components/Texts/InputForm';

CommentInputArea.propTypes = {
  autoFocus: PropTypes.bool,
  clickListenerState: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputFormRef: PropTypes.object,
  numInputRows: PropTypes.number,
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
  numInputRows = 4,
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
        rows={numInputRows}
        placeholder={`Enter your ${inputTypeLabel} here...`}
      />
    </div>
  );
}
