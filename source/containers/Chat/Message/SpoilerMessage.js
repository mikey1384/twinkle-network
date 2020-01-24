import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/ErrorBoundary';
import Embedly from 'components/Embedly';
import { Color } from 'constants/css';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { useAppContext, useChatContext } from 'contexts';
import { socket } from 'constants/io';

SpoilerMessage.propTypes = {
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
  showSubjectMsgsModal: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number,
  userCanEditThis: PropTypes.bool
};

export default function SpoilerMessage({
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
  let [spoilerShown, setSpoilerShown] = useState(false);
  let [grayness, setGrayness] = useState(105);
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
              {spoilerShown ? (
                <span
                  style={{
                    color: isNotification ? Color.gray() : undefined,
                    background: Color.lighterGray(),
                    borderRadius: '2px'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: processedStringWithURL(content.substr(9))
                  }}
                />
              ) : (
                <div
                  style={{
                    background: `rgb(${grayness},${grayness},${grayness})`,
                    height: '2rem',
                    width:
                      content.substr(9).length > 100
                        ? '70rem'
                        : 0.7 * content.substr(9).length + 'rem',
                    borderRadius: '5px'
                  }}
                  onClick={() => setSpoilerShown(true)}
                  onMouseEnter={() => setGrayness(128)}
                  onMouseLeave={() => setGrayness(105)}
                ></div>
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
        {extractedUrl && spoilerShown && messageId && !attachmentHidden && (
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
