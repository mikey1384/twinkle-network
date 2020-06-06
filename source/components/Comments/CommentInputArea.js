import PropTypes from 'prop-types';
import React, { useState } from 'react';
import InputForm from 'components/Forms/InputForm';
import Button from '../Button';
import { useMyState } from 'helpers/hooks';
import AttachContentModal from './AttachContentModal';
import Icon from '../Icon';
import { useInputContext } from 'contexts';
import Attachment from 'containers/Home/Stories/InputPanel/SubjectInput/Attachment';

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
  const {
    state,
    actions: { onSetSubjectAttachment }
  } = useInputContext();
  const { profileTheme } = useMyState();
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const contentType = targetCommentId ? 'comment' : parent.contentType;
  const contentId = targetCommentId || parent.contentId;
  const attachment = state[contentType + contentId]?.attachment;
  console.log(state);
  return (
    <div style={{ ...style, position: 'relative' }} ref={InputFormRef}>
      <div
        style={{
          display: 'flex',
          width: '100%'
        }}
      >
        <InputForm
          style={{
            width: 'CALC(100% - ' + (attachment ? 12 : 5) + 'rem)'
          }}
          innerRef={innerRef}
          clickListenerState={clickListenerState}
          autoFocus={autoFocus}
          onSubmit={(text) =>
            onSubmit({
              content: text,
              subjectId,
              rootCommentId,
              targetCommentId
            })
          }
          parent={
            subjectId
              ? { contentId: subjectId, contentType: 'subject' }
              : parent
          }
          rows={numInputRows}
          placeholder={`Enter your ${inputTypeLabel} here...`}
          targetCommentId={targetCommentId}
        />
        {attachment ? (
          <Attachment
            attachment={attachment}
            onClose={() =>
              onSetSubjectAttachment({
                attachment: undefined,
                attachContentType: contentType + contentId
              })
            }
          />
        ) : (
          <Button
            skeuomorphic
            color={profileTheme}
            onClick={() => setAttachContentModalShown(true)}
            style={{
              height: '4rem',
              width: '4rem',
              marginLeft: '1rem'
            }}
          >
            <Icon size="lg" icon="plus" />
          </Button>
        )}
      </div>
      {attachContentModalShown && (
        <AttachContentModal
          onHide={() => setAttachContentModalShown(false)}
          onConfirm={(content) => {
            onSetSubjectAttachment({
              attachment: content,
              attachContentType: contentType + contentId
            });
            setAttachContentModalShown(false);
          }}
          contentId={contentId}
          contentType={contentType}
        />
      )}
    </div>
  );
}
