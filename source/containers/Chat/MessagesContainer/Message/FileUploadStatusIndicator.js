import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import Context from '../../Context';
import { socket } from 'constants/io';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { updateApiServerToS3Progress } from 'redux/actions/ChatActions';

FileUploadStatusIndicator.propTypes = {
  channelId: PropTypes.number.isRequired,
  content: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  filesBeingUploaded: PropTypes.object.isRequired,
  fileToUpload: PropTypes.object.isRequired,
  filePath: PropTypes.string.isRequired,
  updateApiServerToS3Progress: PropTypes.func.isRequired
};

function FileUploadStatusIndicator({
  channelId,
  content,
  dispatch,
  filesBeingUploaded,
  fileToUpload,
  filePath,
  updateApiServerToS3Progress
}) {
  const { onFileUpload } = useContext(Context);
  useEffect(() => {
    onFileUpload({ channelId, content, filePath, fileToUpload });
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
    updateApiServerToS3Progress: params =>
      dispatch(updateApiServerToS3Progress(params))
  })
)(FileUploadStatusIndicator);
