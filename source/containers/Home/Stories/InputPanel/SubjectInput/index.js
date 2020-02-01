import React, { useContext, memo, useMemo, useRef, useState } from 'react';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import AttachContentModal from './AttachContentModal';
import Attachment from './Attachment';
import ErrorBoundary from 'components/ErrorBoundary';
import LocalContext from '../../../Context';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji
} from 'helpers/stringHelpers';
import uuidv1 from 'uuid/v1';
import SwitchButton from 'components/SwitchButton';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import Icon from 'components/Icon';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import { Color } from 'constants/css';
import { PanelStyle } from '../Styles';
import { charLimit } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useHomeContext, useInputContext } from 'contexts';

function SubjectInput() {
  const filePathRef = useRef(null);
  const { onFileUpload } = useContext(LocalContext);
  const {
    requestHelpers: { uploadContent }
  } = useAppContext();
  const { canEditRewardLevel, profileTheme } = useMyState();
  const {
    state: { fileUploadComplete, fileUploadProgress },
    actions: { onClearFileUploadProgress, onLoadNewFeeds }
  } = useHomeContext();
  const {
    state: { subject },
    actions: {
      onSetHasSecretAnswer,
      onResetSubjectInput,
      onSetSecretAnswer,
      onSetSubjectAttachment,
      onSetSubjectDescription,
      onSetSubjectDescriptionFieldShown,
      onSetSubjectRewardLevel,
      onSetSubjectTitle
    }
  } = useInputContext();
  const {
    attachment,
    descriptionFieldShown,
    details: { title, description, secretAnswer, rewardLevel },
    hasSecretAnswer
  } = subject;
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const titleExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        inputType: 'title',
        contentType: 'subject',
        text: title
      }),
    [title]
  );

  const descriptionExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'subject',
        inputType: 'description',
        text: description
      }),
    [description]
  );

  const secretAnswerExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'subject',
        inputType: 'description',
        text: secretAnswer
      }),
    [secretAnswer]
  );

  const buttonDisabled = useMemo(() => {
    if (title.length > charLimit.subject.title) return true;
    if (description.length > charLimit.subject.description) return true;
    if (
      (hasSecretAnswer && stringIsEmpty(secretAnswer)) ||
      secretAnswer.length > charLimit.subject.description
    ) {
      return true;
    }
    return false;
  }, [description.length, hasSecretAnswer, secretAnswer, title.length]);

  return (
    <ErrorBoundary className={PanelStyle}>
      {!uploadingFile && (
        <>
          <p>Post a subject Twinkle users can talk about</p>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: '100%' }}>
              <Input
                placeholder="A subject Twinkle users can talk about"
                value={title}
                onChange={handleInputChange}
                onKeyUp={event => {
                  onSetSubjectTitle(addEmoji(event.target.value));
                }}
                style={titleExceedsCharLimit?.style}
              />
            </div>
            <div style={{ marginLeft: '1rem' }}>
              {attachment ? (
                <Attachment
                  attachment={attachment}
                  onClose={() => onSetSubjectAttachment(undefined)}
                />
              ) : (
                <Button
                  skeuomorphic
                  color={profileTheme}
                  onClick={() => setAttachContentModalShown(true)}
                >
                  <Icon size="lg" icon="plus" />
                </Button>
              )}
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span
              style={{
                fontSize: '1.2rem',
                color:
                  title.length > charLimit.subject.title
                    ? 'red'
                    : Color.darkerGray()
              }}
            >
              {titleExceedsCharLimit?.message}
            </span>
          </div>
          {descriptionFieldShown && (
            <div style={{ position: 'relative' }}>
              <Textarea
                style={{
                  marginTop: '1rem',
                  ...(descriptionExceedsCharLimit?.style || null)
                }}
                value={description}
                minRows={4}
                placeholder="Enter Description (Optional, you don't need to write this)"
                onChange={event =>
                  onSetSubjectDescription(addEmoji(event.target.value))
                }
                onKeyUp={event => {
                  if (event.key === ' ') {
                    onSetSubjectDescription(addEmoji(event.target.value));
                  }
                }}
              />
              {descriptionExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {descriptionExceedsCharLimit.message}
                </small>
              )}
              {hasSecretAnswer && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '2rem',
                      color: Color.darkerGray()
                    }}
                  >
                    Secret Message
                  </span>
                  <Textarea
                    autoFocus
                    style={{
                      marginTop: '0.5rem',
                      ...(secretAnswerExceedsCharLimit || null)
                    }}
                    value={secretAnswer}
                    minRows={4}
                    placeholder="Enter the Secret Message"
                    onChange={event =>
                      onSetSecretAnswer(addEmoji(event.target.value))
                    }
                    onKeyUp={event => {
                      if (event.key === ' ') {
                        onSetSecretAnswer(addEmoji(event.target.value));
                      }
                    }}
                  />
                  {secretAnswerExceedsCharLimit && (
                    <small style={{ color: 'red' }}>
                      {secretAnswerExceedsCharLimit.message}
                    </small>
                  )}
                </div>
              )}
              {canEditRewardLevel && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>
                    For every star you add, the amount of maximum XP you and
                    other moderators could reward the participants of this
                    subject rises by 1,000 XP.
                  </div>
                  <RewardLevelForm
                    themed
                    style={{
                      marginTop: '1rem',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      padding: '1rem',
                      fontSize: '3rem'
                    }}
                    rewardLevel={rewardLevel}
                    onSetRewardLevel={onSetSubjectRewardLevel}
                  />
                </div>
              )}
              <div style={{ marginTop: '1rem' }} className="button-container">
                <SwitchButton
                  checked={hasSecretAnswer}
                  label="Secret Message"
                  onChange={() => onSetHasSecretAnswer(!hasSecretAnswer)}
                  style={{ marginRight: '1rem' }}
                />
                <Button
                  filled
                  color="green"
                  type="submit"
                  disabled={submitting || buttonDisabled}
                  onClick={handleSubmit}
                >
                  Post!
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {uploadingFile && (
        <FileUploadStatusIndicator
          style={{ fontSize: '1.7rem', fontWeight: 'bold', marginTop: 0 }}
          fileName={attachment?.file?.name}
          onFileUpload={handleFileUpload}
          onUploadComplete={handleFileUploadComplete}
          uploadComplete={fileUploadComplete}
          uploadProgress={fileUploadProgress}
        />
      )}
      {attachContentModalShown && (
        <AttachContentModal
          onHide={() => setAttachContentModalShown(false)}
          onConfirm={content => {
            onSetSubjectAttachment(content);
            setAttachContentModalShown(false);
          }}
        />
      )}
    </ErrorBoundary>
  );

  function handleFileUpload() {
    filePathRef.current = uuidv1();
    onFileUpload({
      fileName: attachment.file.name,
      filePath: filePathRef.current,
      file: attachment.file
    });
  }

  function handleInputChange(text) {
    onSetSubjectTitle(text);
    onSetSubjectDescriptionFieldShown(!!text.length);
    if (!text.length) {
      onSetHasSecretAnswer(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      stringIsEmpty(title) ||
      title.length > charLimit.subject.title ||
      (hasSecretAnswer && stringIsEmpty(secretAnswer))
    ) {
      return;
    }
    setSubmitting(true);
    if (attachment?.contentType === 'file') {
      return setUploadingFile(true);
    }
    handleUploadSubject();
  }

  async function handleFileUploadComplete() {
    await handleUploadSubject({
      filePath: filePathRef.current,
      fileName: attachment.file.name,
      fileSize: attachment.file.size
    });
    filePathRef.current = null;
    onClearFileUploadProgress();
    setUploadingFile(false);
  }

  async function handleUploadSubject(file = {}) {
    try {
      const data = await uploadContent({
        attachment,
        title,
        description: finalizeEmoji(description),
        secretAnswer: hasSecretAnswer ? secretAnswer : '',
        rewardLevel,
        filePath: file.filePath,
        fileName: file.fileName,
        fileSize: file.fileSize
      });
      if (data) {
        onLoadNewFeeds([data]);
        onResetSubjectInput();
      }
      setSubmitting(false);
      return Promise.resolve();
    } catch (error) {
      console.error(error);
    }
  }
}

export default memo(SubjectInput);
