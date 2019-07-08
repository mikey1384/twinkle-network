import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Image from './Image';
import FileIcon from './FileIcon';
import Textarea from 'components/Texts/Textarea';
import {
  addCommasToNumber,
  addEmoji,
  getFileTypeFromFileName,
  renderFileSize
} from 'helpers/stringHelpers';

File.propTypes = {
  captionExceedsCharLimit: PropTypes.object,
  caption: PropTypes.string,
  fileObj: PropTypes.object.isRequired,
  onCaptionChange: PropTypes.func.isRequired
};

export default function File({
  caption,
  captionExceedsCharLimit,
  fileObj,
  onCaptionChange
}) {
  const [fileType, setFileType] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (fileObj) {
      setLoading(false);
    }
    const fileType = getFileTypeFromFileName(fileObj.name);
    setFileType(fileType);
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
            File Size: {addCommasToNumber(fileObj.size)} byte{' '}
            {renderFileSize(fileObj.size)}
          </div>
        </div>
        <div>
          <Textarea
            autoFocus
            placeholder="Add a caption..."
            style={{
              marginTop: '1rem',
              ...(captionExceedsCharLimit?.style || {})
            }}
            value={caption}
            onChange={event => onCaptionChange(event.target.value)}
            onKeyUp={handleKeyUp}
            minRows={3}
          />
          {captionExceedsCharLimit && (
            <div
              style={{
                fontWeight: 'normal',
                fontSize: '1.3rem',
                color: 'red'
              }}
            >
              {captionExceedsCharLimit.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function handleKeyUp(event) {
    if (event.key === ' ') {
      onCaptionChange(addEmoji(event.target.value));
    }
  }
}
