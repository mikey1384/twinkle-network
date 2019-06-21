import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';

UploadModal.propTypes = {
  fileObj: PropTypes.object,
  onHide: PropTypes.func.isRequired
};

export default function UploadModal({ fileObj, onHide }) {
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  useEffect(() => {
    setFileSize(fileObj.size);
    setFileType(
      fileObj.name
        .split('.')
        .pop()
        .toLowerCase()
    );
  }, [fileObj]);

  return (
    <Modal large onHide={onHide}>
      <header>Upload a file</header>
      <main>
        {fileObj ? (
          <div>
            {fileSize}
            {fileType}
          </div>
        ) : (
          <Loading />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => console.log('done')}>
          Upload
        </Button>
      </footer>
    </Modal>
  );
}
