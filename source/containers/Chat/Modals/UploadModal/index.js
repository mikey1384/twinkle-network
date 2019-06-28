import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import File from './File';
import { exceedsCharLimit } from 'helpers/stringHelpers';
import { uploadFileData } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

UploadModal.propTypes = {
  fileObj: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};

function UploadModal({ dispatch, fileObj, onHide }) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  useEffect(() => {
    init();
    function init() {
      const reader = new FileReader();
      reader.onload = upload => {
        setSelectedFile(upload.target.result);
      };
      reader.readAsDataURL(fileObj);
    }
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
    const fileData = new FormData();
    fileData.append('file', selectedFile);
    const data = await uploadFileData({
      dispatch,
      fileData,
      fileName: fileObj.name
    });
    console.log(data);
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(UploadModal);
