import PropTypes from 'prop-types';
import React from 'react';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import InputForm from 'components/Texts/InputForm';

ReplyInputArea.propTypes = {
  rootCommentId: PropTypes.number,
  innerRef: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  rows: PropTypes.number,
  style: PropTypes.object,
  targetCommentId: PropTypes.number
};

export default function ReplyInputArea({
  innerRef,
  onSubmit,
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
          rows={rows}
          placeholder="Enter your reply..."
        />
      </div>
    </ErrorBoundary>
  );
}
