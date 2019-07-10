import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import Context from '../../Context';
import { displayAttachedFile } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

FileUploadStatusIndicator.propTypes = {
  authLevel: PropTypes.number,
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
  onSendFileMessage: PropTypes.func.isRequired,
  partnerId: PropTypes.number,
  profilePicId: PropTypes.number
};

function FileUploadStatusIndicator({
  authLevel,
  channelId,
  checkScrollIsAtTheBottom,
  content,
  dispatch,
  displayAttachedFile,
  filesBeingUploaded,
  fileToUpload,
  filePath,
  onSendFileMessage,
  userId,
  username,
  partnerId,
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
        fileName: fileToUpload.name,
        filePath,
        fileToUpload,
        userId,
        partnerId
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
      const params = {
        fileName: fileToUpload.name,
        filePath,
        uploaderAuthLevel: authLevel,
        channelId,
        userId,
        username,
        profilePicId,
        scrollAtBottom: checkScrollIsAtTheBottom()
      };
      displayAttachedFile(params);
      if (channelId) {
        onSendFileMessage(params);
      }
    }
  }, [filesBeingUploaded]);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    setUploadProgress(
      Math.ceil(5 + 15 * clientToApiServerProgress + 80 * apiServerToS3Progress)
    );
  }, [clientToApiServerProgress, apiServerToS3Progress]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div>{`Uploading ${fileToUpload.name}...`}</div>
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
    authLevel: state.UserReducer.authLevel,
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
