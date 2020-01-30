import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import AlertModal from 'components/Modals/AlertModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { isMobile } from 'helpers';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';
import { useInputContext } from 'contexts';

StartScreen.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function StartScreen({ navigateTo, onHide }) {
  const {
    actions: { onSetSubjectAttachment }
  } = useInputContext();
  const { authLevel } = useMyState();
  const [alertModalShown, setAlertModalShown] = useState(false);
  const FileInputRef = useRef(null);
  const mb = 1000;
  const maxSize = useMemo(
    () =>
      authLevel > 3
        ? 5000 * mb
        : authLevel > 1
        ? 3000 * mb
        : authLevel === 1
        ? 1000 * mb
        : 300 * mb,
    [authLevel]
  );

  return (
    <ErrorBoundary style={{ display: 'flex', width: '100%' }}>
      <div
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.black()
          }}
        >
          Upload from your {isMobile(navigator) ? 'device' : 'computer'}
        </div>
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex'
          }}
        >
          <Button
            skeuomorphic
            style={{ fontSize: '3.5rem', padding: '1.5rem' }}
            color="blue"
            onClick={() => FileInputRef.current.click()}
          >
            <Icon icon="upload" />
          </Button>
        </div>
      </div>
      <div
        style={{
          width: '50%',
          flexDirection: 'column',
          alignItems: 'center',
          display: 'flex',
          marginLeft: '1rem'
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.black()
          }}
        >
          Select from Twinkle Website
        </div>
        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex'
          }}
        >
          <Button
            skeuomorphic
            style={{ fontSize: '2rem' }}
            color="logoBlue"
            onClick={() => navigateTo('selectVideo')}
          >
            <Icon icon="film" />
            <span style={{ marginLeft: '1rem' }}>Video</span>
          </Button>
          <Button
            skeuomorphic
            style={{ fontSize: '2rem', marginLeft: '1rem' }}
            color="pink"
            onClick={() => navigateTo('selectLink')}
          >
            <Icon icon="link" />
            <span style={{ marginLeft: '1rem' }}>Link</span>
          </Button>
        </div>
      </div>
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
      />
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${maxSize /
            mb} MB`}
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );

  function handleUpload(event) {
    const file = event.target.files[0];
    if (file.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    const { fileType } = getFileInfoFromFileName(file.name);
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = upload => {
        const payload = upload.target.result;
        window.loadImage(
          payload,
          function(img) {
            const imageUrl = img.toDataURL('image/jpeg');
            const dataUri = imageUrl.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(dataUri, 'base64');
            // eslint-disable-next-line no-undef
            const file = new File([buffer], file.name);
            onSetSubjectAttachment({
              attachment: file,
              contentType: 'file',
              fileType: 'image',
              imageUrl
            });
          },
          { orientation: true }
        );
      };
      reader.readAsDataURL(file);
    } else {
      onSetSubjectAttachment({
        attachment: file,
        contentType: 'file',
        fileType
      });
    }
    onHide();
    event.target.value = null;
  }
}
