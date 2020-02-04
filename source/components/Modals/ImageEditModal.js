import React, { useRef, useState, useEffect } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ErrorBoundary from 'components/ErrorBoundary';
import Loading from 'components/Loading';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import { useAppContext, useContentContext } from 'contexts';

ImageEditModal.propTypes = {
  imageUri: PropTypes.string,
  onHide: PropTypes.func.isRequired
};

export default function ImageEditModal({ onHide, imageUri }) {
  const {
    requestHelpers: { uploadFile, uploadProfilePic }
  } = useAppContext();
  const {
    actions: { onUploadProfilePic }
  } = useContentContext();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 1,
    x: 5
  });
  const [loading, setLoading] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const ImageRef = useRef(null);
  useEffect(() => {
    setLoading(true);
    window.loadImage(
      imageUri,
      function(img) {
        const image = img.toDataURL('image/jpeg');
        setOriginalImageUrl(image);
        setLoading(false);
      },
      { orientation: true }
    );
  }, [imageUri]);

  return (
    <Modal onHide={onHide}>
      <ErrorBoundary>
        <header>Edit your picture</header>
        <main>
          <div
            style={{
              textAlign: 'center',
              paddingBottom: '1rem'
            }}
          >
            {loading && <Loading text="Loading..." />}
            {!loading && imageUri && (
              <ReactCrop
                // eslint-disable-next-line no-undef
                src={originalImageUrl}
                crop={crop}
                minWidth={250}
                minHeight={250}
                keepSelection
                ruleOfThirds
                onImageLoaded={image => (ImageRef.current = image)}
                onChange={newCrop => setCrop(newCrop)}
                onComplete={handleCropComplete}
                imageStyle={{
                  objectFit: 'contain',
                  minHeight: '350px',
                  maxHeight: '65vh'
                }}
              />
            )}
          </div>
          {uploading && (
            <FileUploadStatusIndicator
              style={{ width: '20rem' }}
              onFileUpload={handleFileUpload}
              uploadComplete={uploadComplete}
              uploadProgress={uploadProgress}
            />
          )}
        </main>
        <footer>
          <Button
            transparent
            onClick={onHide}
            style={{ marginRight: '0.7rem' }}
          >
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => setUploading(true)}
            disabled={processing}
          >
            Submit
          </Button>
        </footer>
      </ErrorBoundary>
    </Modal>
  );

  async function handleCropComplete(crop) {
    if (crop.width && crop.height) {
      const cropped = getCroppedImg({
        image: ImageRef.current,
        crop
      });
      setCroppedImageUrl(cropped);
    }
  }

  function getCroppedImg({ image, crop }) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    return canvas.toDataURL('image/jpeg');
  }

  async function handleFileUpload() {
    setProcessing(true);
    const { imageId, userId } = await uploadProfilePic();
    const dataUri = croppedImageUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataUri, 'base64');
    const fileName = `${imageId}.jpg`;
    const file = new File([buffer], fileName);
    await uploadFile({
      context: 'profilePic',
      filePath: userId,
      file,
      onUploadProgress: handleUploadProgress
    });
    onUploadProfilePic({ userId, imageId });
    setUploadComplete(true);
    setProcessing(false);
    onHide();
  }

  function handleUploadProgress({ loaded, total }) {
    setUploadProgress(loaded / total);
  }
}
