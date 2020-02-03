import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import { Color } from 'constants/css';

FileUploadStatusIndicator.propTypes = {
  fileName: PropTypes.string,
  uploadComplete: PropTypes.bool,
  uploadProgress: PropTypes.number,
  onFileUpload: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function FileUploadStatusIndicator({
  fileName,
  onFileUpload,
  style,
  uploadComplete,
  uploadProgress
}) {
  useEffect(() => {
    if (typeof uploadProgress !== 'number') {
      onFileUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = useMemo(() => (uploadComplete ? 'Upload Complete!' : ''), [
    uploadComplete
  ]);
  const color = useMemo(() => (uploadComplete ? Color.green() : undefined), [
    uploadComplete
  ]);
  const progress = useMemo(
    () => (uploadComplete ? 100 : Math.ceil(100 * uploadProgress)),
    [uploadComplete, uploadProgress]
  );

  return (
    <div style={{ marginTop: '1rem', ...style }}>
      <div>{`Uploading ${fileName}...`}</div>
      <ProgressBar text={text} color={color} progress={progress} />
    </div>
  );
}
