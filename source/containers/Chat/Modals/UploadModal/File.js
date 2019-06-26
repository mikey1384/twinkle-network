import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Image from './Image';
import FileIcon from './FileIcon';
import Textarea from 'components/Texts/Textarea';
import { addCommasToNumber } from 'helpers/stringHelpers';

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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ width: '13vw', height: '13vw' }}>
        {fileType === 'image' && <Image imageObj={fileObj} />}
        {fileType !== 'image' && <FileIcon fileType={fileType} />}
      </div>
      <div
        style={{
          width: 'CALC(100% - 13vw - 2rem)',
          fontSize: '2rem',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div>File Name: {fileObj.name}</div>
          <div>
            File Size: {addCommasToNumber(fileObj.size)} byte
            {renderFileSize(fileObj.size)}
          </div>
        </div>
        <div>
          <Textarea
            autoFocus
            style={{ marginTop: '1rem' }}
            value="text"
            onChange={() => console.log('change')}
            minRows={3}
          />
        </div>
      </div>
    </div>
  );
}

function checkFileType(extension) {
  const audioExt = ['wav', '.aif', 'mp3', 'mid'];
  const imageExt = ['jpg', 'png', 'jpeg', 'bmp', 'gif'];
  const movieExt = ['avi', 'flv', 'wmv', 'mov', 'mp4', '3gp', 'ogg', 'm4v'];
  const compressedExt = ['zip', 'rar', 'arj', 'tar', 'gz', 'tgz'];
  const wordExt = ['docx', 'docm', 'dotx', 'dotm', 'docb'];
  if (audioExt.indexOf(extension) !== -1) {
    return 'audio';
  }
  if (imageExt.indexOf(extension) !== -1) {
    return 'image';
  }
  if (movieExt.indexOf(extension) !== -1) {
    return 'video';
  }
  if (compressedExt.indexOf(extension) !== -1) {
    return 'archive';
  }
  if (wordExt.indexOf(extension) !== -1) {
    return 'word';
  }
  if (extension === 'pdf') {
    return 'pdf';
  }
  return 'other';
}

function renderFileSize(fileSize) {
  if (fileSize > 1000000) {
    return ` (${(fileSize / 1000000).toFixed(2)} MB)`;
  }
  if (fileSize > 1000) {
    return ` (${(fileSize / 1000).toFixed(2)} KB)`;
  }
  return null;
}
