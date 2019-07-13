import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import File from './File';
import uuidv1 from 'uuid/v1';
import { exceedsCharLimit, finalizeEmoji } from 'helpers/stringHelpers';
import { submitMessageAsync } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';

UploadModal.propTypes = {
  channelId: PropTypes.number,
  fileObj: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number,
  submitMessage: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};

function UploadModal({
  channelId,
  dispatch,
  fileObj,
  onHide,
  submitMessage,
  userId,
  username,
  profilePicId
}) {
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

  return (
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
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
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
  );

  async function handleSubmit() {
    submitMessage({
      profilePicId,
      userId,
      username,
      content: finalizeEmoji(caption),
      channelId,
      fileToUpload: selectedFile,
      filePath: uuidv1(),
      fileName: selectedFile.name
    });
    onHide();
  }
}

export default connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId
  }),
  dispatch => ({
    dispatch,
    submitMessage: params => dispatch(submitMessageAsync(params))
  })
)(UploadModal);
