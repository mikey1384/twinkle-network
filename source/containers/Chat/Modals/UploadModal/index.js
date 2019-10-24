import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import File from './File';
import uuidv1 from 'uuid/v1';
import { exceedsCharLimit, finalizeEmoji } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useChatContext } from 'contexts';

UploadModal.propTypes = {
  channelId: PropTypes.number,
  fileObj: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  subjectId: PropTypes.number
};

export default function UploadModal({ channelId, fileObj, onHide, subjectId }) {
  const { profilePicId, userId, username } = useMyState();
  const {
    actions: { onSubmitMessage }
  } = useChatContext();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    setSelectedFile(fileObj);
  }, []);
  const captionExceedsCharLimit = exceedsCharLimit({
    inputType: 'message',
    contentType: 'chat',
    text: caption
  });

  return useMemo(
    () => (
      <Modal onHide={onHide}>
        <header>Upload a file</header>
        <main>
          {fileObj ? (
            <File
              caption={caption}
              captionExceedsCharLimit={captionExceedsCharLimit}
              fileObj={fileObj}
              onCaptionChange={setCaption}
            />
          ) : (
            <Loading />
          )}
        </main>
        <footer>
          <Button
            transparent
            style={{ marginRight: '0.7rem' }}
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button
            disabled={captionExceedsCharLimit}
            color="blue"
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </footer>
      </Modal>
    ),
    [caption, captionExceedsCharLimit, fileObj, subjectId, selectedFile]
  );

  function handleSubmit() {
    onSubmitMessage({
      content: finalizeEmoji(caption),
      channelId,
      fileToUpload: selectedFile,
      filePath: uuidv1(),
      fileName: selectedFile.name,
      profilePicId,
      subjectId,
      userId,
      username
    });
    onHide();
  }
}
