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
      <div style={{ width: '15vw', height: '15vw' }}>
        {fileType === 'image' && <Image imageObj={fileObj} />}
        {fileType !== 'image' && <FileIcon />}
      </div>
      <div
        style={{
          width: 'CALC(100% - 15vw - 1rem)',
          fontSize: '2rem',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div>File Name: {fileObj.name}</div>
          <div>File Size: {addCommasToNumber(fileObj.size)} byte</div>
        </div>
        <div>
          <Textarea
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
  const imageExt = ['jpg', 'png', 'jpeg'];
  if (imageExt.indexOf(extension) !== -1) {
    return 'image';
  }
  return 'other files';
}
