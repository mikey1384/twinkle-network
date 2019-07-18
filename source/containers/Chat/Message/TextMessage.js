import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';
import { processedStringWithURL } from 'helpers/stringHelpers';

TextMessage.propTypes = {
  content: PropTypes.string.isRequired,
  isNotification: PropTypes.bool,
  isReloadedSubject: PropTypes.bool,
  isSubject: PropTypes.bool,
  MessageStyle: PropTypes.object,
  numMsgs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onEdit: PropTypes.bool,
  onEditCancel: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  showSubjectMsgsModal: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number
};

export default function TextMessage({
  content,
  isNotification,
  isReloadedSubject,
  isSubject,
  MessageStyle,
  numMsgs,
  onEdit,
  onEditCancel,
  onEditDone,
  subjectId,
  showSubjectMsgsModal,
  socketConnected
}) {
  return (
    <ErrorBoundary>
      {onEdit ? (
        <EditTextArea
          autoFocus
          disabled={!socketConnected}
          rows={2}
          text={content}
          onCancel={onEditCancel}
          onEditDone={onEditDone}
        />
      ) : (
        <div>
          <div className={MessageStyle.messageWrapper}>
            {renderPrefix()}
            <span
              style={{ color: isNotification ? Color.gray() : undefined }}
              dangerouslySetInnerHTML={{
                __html: processedStringWithURL(content)
              }}
            />
          </div>
          {!!isReloadedSubject && !!numMsgs && numMsgs > 0 && (
            <div className={MessageStyle.relatedConversationsButton}>
              <Button
                filled
                color="logoBlue"
                onClick={() => showSubjectMsgsModal({ subjectId, content })}
              >
                Show related conversations
              </Button>
            </div>
          )}
        </div>
      )}
    </ErrorBoundary>
  );

  function renderPrefix() {
    let prefix = '';
    if (isSubject) {
      prefix = <span className={MessageStyle.subjectPrefix}>Subject: </span>;
    }
    if (isReloadedSubject) {
      prefix = (
        <span className={MessageStyle.subjectPrefix}>
          {'Returning Subject: '}
        </span>
      );
    }
    return prefix;
  }
}
