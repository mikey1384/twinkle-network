import PropTypes from 'prop-types';
import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import InputForm from 'components/Forms/InputForm';

ReplyInputArea.propTypes = {
  rootCommentId: PropTypes.number,
  innerRef: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  rows: PropTypes.number,
  style: PropTypes.object,
  targetCommentId: PropTypes.number
};

export default function ReplyInputArea({
  innerRef,
  onSubmit,
  parent,
  rootCommentId,
  style,
  targetCommentId,
  rows = 1
}) {
  return (
    <ErrorBoundary>
      <div style={style}>
        <InputForm
          innerRef={innerRef}
          onSubmit={text =>
            onSubmit({ content: text, rootCommentId, targetCommentId })
          }
          parent={parent}
          placeholder="Enter your reply..."
          rows={rows}
          targetCommentId={targetCommentId}
        />
      </div>
    </ErrorBoundary>
  );
}
