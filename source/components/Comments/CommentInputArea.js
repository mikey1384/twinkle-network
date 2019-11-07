import PropTypes from 'prop-types';
import React from 'react';
import InputForm from 'components/Forms/InputForm';

CommentInputArea.propTypes = {
  autoFocus: PropTypes.bool,
  clickListenerState: PropTypes.bool,
  inputTypeLabel: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputFormRef: PropTypes.object,
  numInputRows: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  rootCommentId: PropTypes.number,
  subjectId: PropTypes.number,
  targetCommentId: PropTypes.number,
  style: PropTypes.object
};

export default function CommentInputArea({
  autoFocus,
  clickListenerState,
  innerRef,
  inputTypeLabel,
  InputFormRef,
  numInputRows = 4,
  onSubmit,
  parent,
  rootCommentId,
  subjectId,
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
          onSubmit({ content: text, subjectId, rootCommentId, targetCommentId })
        }
        parent={
          subjectId ? { contentId: subjectId, contentType: 'subject' } : parent
        }
        rows={numInputRows}
        placeholder={`Enter your ${inputTypeLabel} here...`}
        targetCommentId={targetCommentId}
      />
    </div>
  );
}
