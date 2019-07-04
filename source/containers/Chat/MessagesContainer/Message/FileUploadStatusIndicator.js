import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import { socket } from 'constants/io';
import { connect } from 'react-redux';
import { uploadFileData } from 'helpers/requestHelpers';

FileUploadStatusIndicator.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fileToUpload: PropTypes.object.isRequired
};

function FileUploadStatusIndicator({ dispatch, fileToUpload }) {
  useEffect(() => {
    socket.on('receive_chat_file_upload_progress', onReceiveUploadProgress);
    return function cleanUp() {
      socket.removeListener(
        'receive_chat_file_upload_progress',
        onReceiveUploadProgress
      );
    };

    function onReceiveUploadProgress(progress) {
      console.log(progress);
    }
  });

  useEffect(() => {
    init();
    async function init() {
      const path = uuidv1();
      const data = await uploadFileData({
        dispatch,
        selectedFile: fileToUpload,
        onUploadProgress: handleUploadProgress,
        path
      });
      console.log(data);
    }
    function handleUploadProgress({ loaded, total }) {
      console.log((loaded * 100) / total, 'new');
    }
  }, []);
  return (
    <div>
      <div>This is a file upload status indicator</div>
    </div>
  );
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(FileUploadStatusIndicator);
