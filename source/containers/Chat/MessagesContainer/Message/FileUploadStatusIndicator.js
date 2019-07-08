import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import Context from '../../Context';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

FileUploadStatusIndicator.propTypes = {
  channelId: PropTypes.number.isRequired,
  content: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  filesBeingUploaded: PropTypes.object.isRequired,
  fileToUpload: PropTypes.object.isRequired,
  filePath: PropTypes.string.isRequired
};

function FileUploadStatusIndicator({
  channelId,
  content,
  dispatch,
  filesBeingUploaded,
  fileToUpload,
  filePath
}) {
  const { onFileUpload } = useContext(Context);
  useEffect(() => {
    if (
      !filesBeingUploaded[channelId] ||
      filesBeingUploaded[channelId].filter(file => file.filePath === filePath)
        .length === 0
    ) {
      onFileUpload({ channelId, content, filePath, fileToUpload });
    }
  }, []);
  const [
    {
      uploadComplete = false,
      clientToApiServerProgress = 0,
      apiServerToS3Progress = 0
    } = {}
  ] =
    filesBeingUploaded[channelId]?.filter(
      ({ filePath: path }) => path === filePath
    ) || [];
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    setUploadProgress(
      Math.ceil(5 + 15 * clientToApiServerProgress + 80 * apiServerToS3Progress)
    );
  }, [clientToApiServerProgress, apiServerToS3Progress]);

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
    dispatch
  })
)(FileUploadStatusIndicator);
