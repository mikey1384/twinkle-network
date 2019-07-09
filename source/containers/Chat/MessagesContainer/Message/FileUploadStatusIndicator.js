import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import Context from '../../Context';
import { displayAttachedFile } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

FileUploadStatusIndicator.propTypes = {
  channelId: PropTypes.number.isRequired,
  checkScrollIsAtTheBottom: PropTypes.func.isRequired,
  content: PropTypes.string,
  displayAttachedFile: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  filesBeingUploaded: PropTypes.object.isRequired,
  fileToUpload: PropTypes.object.isRequired,
  filePath: PropTypes.string.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string,
  profilePicId: PropTypes.number
};

function FileUploadStatusIndicator({
  channelId,
  checkScrollIsAtTheBottom,
  content,
  dispatch,
  displayAttachedFile,
  filesBeingUploaded,
  fileToUpload,
  filePath,
  userId,
  username,
  profilePicId
}) {
  const { onFileUpload } = useContext(Context);
  useEffect(() => {
    if (
      !filesBeingUploaded[channelId] ||
      filesBeingUploaded[channelId].filter(file => file.filePath === filePath)
        .length === 0
    ) {
      onFileUpload({
        channelId,
        content,
        filePath,
        fileToUpload
      });
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
  useEffect(() => {
    if (uploadComplete) {
      displayAttachedFile({
        channelId,
        filePath,
        userId,
        username,
        profilePicId,
        scrollAtBottom: checkScrollIsAtTheBottom()
      });
    }
  }, [filesBeingUploaded]);
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
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId,
    filesBeingUploaded: state.ChatReducer.filesBeingUploaded
  }),
  dispatch => ({
    dispatch,
    displayAttachedFile: params => dispatch(displayAttachedFile(params))
  })
)(FileUploadStatusIndicator);
