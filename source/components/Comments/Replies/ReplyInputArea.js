import PropTypes from 'prop-types';
import React from 'react';
import InputForm from 'components/Texts/InputForm';

ReplyInputArea.propTypes = {
  rootCommentId: PropTypes.number,
  innerRef: PropTypes.func,
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
  );
}
