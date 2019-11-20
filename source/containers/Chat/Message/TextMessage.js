import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/ErrorBoundary';
import Embedly from 'components/Embedly';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { processedStringWithURL } from 'helpers/stringHelpers';

TextMessage.propTypes = {
  content: PropTypes.string.isRequired,
  extractedUrl: PropTypes.string,
  isNotification: PropTypes.bool,
  isReloadedSubject: PropTypes.bool,
  isSubject: PropTypes.bool,
  messageId: PropTypes.number,
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
  extractedUrl,
  isNotification,
  isReloadedSubject,
  isSubject,
  messageId,
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
          contentId={messageId}
          contentType="chat"
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
      {extractedUrl && messageId && (
        <div
          style={{
            marginTop: '1rem'
          }}
          className={css`
            display: flex;
            width: 40%;
            height: 35vw;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              height: 65vw;
            }
          `}
        >
          <Embedly
            contentId={messageId}
            contentType="chat"
            imageHeight="25vw"
            imageMobileHeight="60vw"
          />
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
