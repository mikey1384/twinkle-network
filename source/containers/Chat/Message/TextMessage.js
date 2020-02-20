import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/ErrorBoundary';
import Embedly from 'components/Embedly';
import { Color } from 'constants/css';
import { processedStringWithURL, isValidSpoiler } from 'helpers/stringHelpers';
import { useAppContext, useChatContext } from 'contexts';
import { socket } from 'constants/io';
import Spoiler from './Spoiler';

TextMessage.propTypes = {
  attachmentHidden: PropTypes.bool,
  channelId: PropTypes.number,
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
  onScrollToBottom: PropTypes.func.isRequired,
  showSubjectMsgsModal: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number,
  userCanEditThis: PropTypes.bool
};

export default function TextMessage({
  attachmentHidden,
  channelId,
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
  onScrollToBottom,
  subjectId,
  showSubjectMsgsModal,
  socketConnected,
  userCanEditThis
}) {
  const {
    actions: { onHideAttachment }
  } = useChatContext();
  const {
    requestHelpers: { hideAttachment }
  } = useAppContext();

  return (
    <ErrorBoundary>
      <div>
        {onEdit ? (
          <EditTextArea
            allowEmptyText
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
              {isValidSpoiler(content) ? (
                <Spoiler content={content} onSpoilerClick={onScrollToBottom} />
              ) : (
                <span
                  style={{ color: isNotification ? Color.gray() : undefined }}
                  dangerouslySetInnerHTML={{
                    __html: processedStringWithURL(content)
                  }}
                />
              )}
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
        {extractedUrl && messageId && !attachmentHidden && (
          <Embedly
            style={{ marginTop: '1rem' }}
            contentId={messageId}
            contentType="chat"
            imageHeight="20vw"
            imageMobileHeight="25vw"
            loadingHeight="30vw"
            mobileLoadingHeight="70vw"
            onHideAttachment={handleHideAttachment}
            userCanEditThis={userCanEditThis}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  async function handleHideAttachment() {
    await hideAttachment(messageId);
    onHideAttachment(messageId);
    socket.emit('hide_message_attachment', { channelId, messageId });
  }

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
