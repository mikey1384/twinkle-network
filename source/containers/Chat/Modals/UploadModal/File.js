import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';

File.propTypes = {
  fileName: PropTypes.string,
  fileSize: PropTypes.number,
  fileType: PropTypes.string
};

export default function File({ fileName, fileSize, fileType }) {
  const [loading, setLoading] = useState(true);
  const [isImage, setIsImage] = useState(false);
  useEffect(() => {
    if (fileType) {
      setLoading(false);
    }
    setIsImage(checkIsImage(fileType));
  }, [fileType]);
  return loading ? (
    <Loading />
  ) : (
    <div>
      {isImage ? 'it is an image' : 'it is not an image'}
      <div>{fileName}</div>
      <div>{fileSize}</div>
    </div>
  );
}

function checkIsImage(fileType) {
  const imageExt = ['jpg', 'png', 'jpeg'];
  return imageExt.indexOf(fileType) !== -1;
}
