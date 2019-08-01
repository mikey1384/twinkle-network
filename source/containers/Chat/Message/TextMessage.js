import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
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
  linkTitle: PropTypes.string,
  linkDescription: PropTypes.string,
  linkUrl: PropTypes.string,
  MessageStyle: PropTypes.object,
  numMsgs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onEdit: PropTypes.bool,
  onEditCancel: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  showSubjectMsgsModal: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number,
  thumbUrl: PropTypes.string
};

export default function TextMessage({
  content,
  extractedUrl,
  isNotification,
  isReloadedSubject,
  isSubject,
  linkDescription,
  linkTitle,
  linkUrl,
  messageId,
  MessageStyle,
  numMsgs,
  onEdit,
  onEditCancel,
  onEditDone,
  subjectId,
  showSubjectMsgsModal,
  socketConnected,
  thumbUrl
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
      {extractedUrl && (
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
            }
          `}
        >
          <Embedly
            forChat
            url={extractedUrl}
            contentId={messageId}
            type="chat"
            objectFit="contain"
            imageHeight="25vw"
            imageMobileHeight="60vw"
            siteUrl={linkUrl}
            thumbUrl={thumbUrl}
            actualDescription={linkDescription}
            actualTitle={linkTitle}
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
