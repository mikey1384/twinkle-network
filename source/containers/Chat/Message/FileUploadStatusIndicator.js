import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import LocalContext from '../Context';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';

FileUploadStatusIndicator.propTypes = {
  channelId: PropTypes.number.isRequired,
  checkScrollIsAtTheBottom: PropTypes.func.isRequired,
  content: PropTypes.string,
  fileToUpload: PropTypes.object.isRequired,
  filePath: PropTypes.string.isRequired,
  onSendFileMessage: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  subjectId: PropTypes.number
};

export default function FileUploadStatusIndicator({
  channelId,
  checkScrollIsAtTheBottom,
  content,
  fileToUpload,
  filePath,
  onSendFileMessage,
  recepientId,
  subjectId
}) {
  const { authLevel, profilePicId, userId, username } = useMyState();
  const {
    state: { filesBeingUploaded, replyTarget },
    actions: { onDisplayAttachedFile, onSetReplyTarget }
  } = useChatContext();
  const { onFileUpload } = useContext(LocalContext);
  useEffect(() => {
    if (
      !filesBeingUploaded[channelId] ||
      filesBeingUploaded[channelId].filter(file => file.filePath === filePath)
        .length === 0
    ) {
      onFileUpload({
        channelId,
        content,
        fileName: fileToUpload.name,
        filePath,
        fileToUpload,
        userId,
        recepientId,
        targetMessageId: replyTarget?.id,
        subjectId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [
    { id: messageId, uploadComplete = false, uploadProgress } = {}
  ] = useMemo(() => {
    return (
      filesBeingUploaded[channelId]?.filter(
        ({ filePath: path }) => path === filePath
      ) || []
    );
  }, [channelId, filePath, filesBeingUploaded]);

  useEffect(() => {
    if (uploadComplete) {
      const params = {
        content,
        fileName: fileToUpload.name,
        filePath,
        id: messageId,
        uploaderAuthLevel: authLevel,
        channelId,
        userId,
        username,
        profilePicId,
        scrollAtBottom: checkScrollIsAtTheBottom()
      };
      onDisplayAttachedFile(params);
      if (channelId) {
        onSendFileMessage({ ...params, targetMessage: replyTarget });
      }
      onSetReplyTarget(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authLevel,
    channelId,
    content,
    filePath,
    fileToUpload.name,
    filesBeingUploaded,
    profilePicId,
    replyTarget,
    uploadComplete,
    userId,
    username
  ]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div>{`Uploading ${fileToUpload.name}...`}</div>
      <ProgressBar
        text={uploadComplete ? 'Upload Complete!' : ''}
        color={uploadComplete ? Color.green() : Color.blue()}
        progress={uploadComplete ? 100 : Math.ceil(100 * uploadProgress)}
      />
    </div>
  );
}
