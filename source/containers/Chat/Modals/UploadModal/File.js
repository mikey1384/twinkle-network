import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Image from './Image';

File.propTypes = {
  fileObj: PropTypes.object.isRequired
};

export default function File({ fileObj }) {
  const [fileType, setFileType] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (fileObj) {
      setLoading(false);
    }
    const extension = fileObj.name
      .split('.')
      .pop()
      .toLowerCase();
    setFileType(checkFileType(extension));
  }, [fileObj]);
  return loading ? (
    <Loading />
  ) : (
    <div>
      {fileType === 'image' && <Image imageObj={fileObj} />}
      {fileType !== 'image' && <div>not an image</div>}
      <div>{fileObj.name}</div>
      <div>{fileObj.size}</div>
    </div>
  );
}

function checkFileType(extension) {
  const imageExt = ['jpg', 'png', 'jpeg'];
  if (imageExt.indexOf(extension) !== -1) {
    return 'image';
  }
  return 'other files';
}
