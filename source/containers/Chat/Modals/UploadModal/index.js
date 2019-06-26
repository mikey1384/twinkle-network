import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loading from 'components/Loading';
import File from './File';

UploadModal.propTypes = {
  fileObj: PropTypes.object,
  onHide: PropTypes.func.isRequired
};

export default function UploadModal({ fileObj, onHide }) {
  return (
    <Modal onHide={onHide}>
      <header>Upload a file</header>
      <main>{fileObj ? <File fileObj={fileObj} /> : <Loading />}</main>
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
