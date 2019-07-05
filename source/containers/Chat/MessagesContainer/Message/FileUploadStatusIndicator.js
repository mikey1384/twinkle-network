import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import { socket } from 'constants/io';
import { connect } from 'react-redux';
import { uploadFileData } from 'helpers/requestHelpers';
import { Color } from 'constants/css';
import {
  postFileUploadStatus,
  postUploadComplete,
  updateApiServerToS3Progress,
  updateClientToApiServerProgress
} from 'redux/actions/ChatActions';

FileUploadStatusIndicator.propTypes = {
  channelId: PropTypes.number.isRequired,
  content: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  filesBeingUploaded: PropTypes.object.isRequired,
  fileToUpload: PropTypes.object.isRequired,
  filePath: PropTypes.string.isRequired,
  postFileUploadStatus: PropTypes.func.isRequired,
  postUploadComplete: PropTypes.func.isRequired,
  updateApiServerToS3Progress: PropTypes.func.isRequired,
  updateClientToApiServerProgress: PropTypes.func.isRequired
};

function FileUploadStatusIndicator({
  channelId,
  content,
  dispatch,
  filesBeingUploaded,
  fileToUpload,
  filePath,
  postFileUploadStatus,
  postUploadComplete,
  updateApiServerToS3Progress,
  updateClientToApiServerProgress
}) {
  useEffect(() => {
    postFileUploadStatus({ channelId, content, filePath });
    init();
    async function init() {
      const data = await uploadFileData({
        channelId,
        content,
        dispatch,
        selectedFile: fileToUpload,
        onUploadProgress: handleUploadProgress,
        path: filePath
      });
      postUploadComplete({
        path: filePath,
        channelId,
        result: !!data?.success
      });
      function handleUploadProgress({ loaded, total }) {
        updateClientToApiServerProgress({
          channelId,
          path: filePath,
          progress: loaded / total
        });
      }
    }
  }, []);
  const [
    {
      uploadComplete = false,
      clientToApiServerProgress = 0,
      apiServerToS3Progress = 0
    } = {}
  ] =
    filesBeingUploaded[channelId]?.filter(({ path }) => path === filePath) ||
    [];
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    setUploadProgress(
      Math.ceil(5 + 15 * clientToApiServerProgress + 80 * apiServerToS3Progress)
    );
  }, [clientToApiServerProgress, apiServerToS3Progress]);
  useEffect(() => {
    socket.on('receive_chat_file_upload_progress', onReceiveUploadProgress);
    return function cleanUp() {
      socket.removeListener(
        'receive_chat_file_upload_progress',
        onReceiveUploadProgress
      );
    };

    function onReceiveUploadProgress({ path, percentage }) {
      if (path === filePath) {
        updateApiServerToS3Progress({
          progress: percentage / 100,
          channelId,
          path: filePath
        });
      }
    }
  });

  return (
    <div>
      <ProgressBar
        text={uploadComplete ? 'Upload Complete!' : ''}
        color={uploadComplete ? Color.green() : Color.blue()}
        progress={uploadComplete ? 100 : uploadProgress}
      />
    </div>
  );
}

export default connect(
  state => ({
    filesBeingUploaded: state.ChatReducer.filesBeingUploaded
  }),
  dispatch => ({
    dispatch,
    postFileUploadStatus: params => dispatch(postFileUploadStatus(params)),
    postUploadComplete: params => dispatch(postUploadComplete(params)),
    updateClientToApiServerProgress: params =>
      dispatch(updateClientToApiServerProgress(params)),
    updateApiServerToS3Progress: params =>
      dispatch(updateApiServerToS3Progress(params))
  })
)(FileUploadStatusIndicator);
