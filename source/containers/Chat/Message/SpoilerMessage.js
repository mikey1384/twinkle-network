import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Embedly from 'components/Embedly';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { processedStringWithURL } from 'helpers/stringHelpers';

SpoilerMessage.propTypes = {
  content: PropTypes.string.isRequired,
  extractedUrl: PropTypes.string,
  isNotification: PropTypes.bool,
  isReloadedSubject: PropTypes.bool,
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

export default function SpoilerMessage({
  content,
  extractedUrl,
  isNotification,
  isReloadedSubject,
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
  let [spoilerShown, setSpoilerShown] = useState(false);
  return (
    <ErrorBoundary>
      {onEdit ? (
        <EditTextArea
          contentId={messageId}
          contentType="chat"
          autoFocus
          disabled={!socketConnected}
          rows={2}
          text={'/spoiler ' + content}
          onCancel={onEditCancel}
          onEditDone={onEditDone}
        />
      ) : !spoilerShown ? (
        <div
          style={{
            background: Color.darkGray(),
            width: `${
              0.7 * content.length <= 100 ? 0.7 * content.length : 100
            }rem`,
            height: '2.8rem',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => setSpoilerShown(true)}
        />
      ) : (
        <div>
          <div className={MessageStyle.messageWrapper}>
            <span
              style={{
                color: isNotification ? Color.gray() : undefined,
                background: 'rgba(125, 125, 125, 0.2)',
                borderRadius: '3px',
                width: `${0.7 * content.length}rem`
              }}
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
      {extractedUrl && spoilerShown && messageId && (
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
}
