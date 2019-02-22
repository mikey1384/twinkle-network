import React, { useRef, useState } from 'react';
import Modal from 'components/Modal';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import AvatarEditor from 'react-avatar-editor';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';

ImageEditModal.propTypes = {
  imageUri: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  processing: PropTypes.bool
};

export default function ImageEditModal({
  onHide,
  imageUri,
  onConfirm,
  processing
}) {
  const [imageScale, setImageScale] = useState(1);
  const EditorRef = useRef(null);

  return (
    <Modal onHide={onHide}>
      <ErrorBoundary>
        <header>Create Profile Picture</header>
        <main>
          <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
            {imageUri && (
              <div>
                <AvatarEditor
                  ref={EditorRef}
                  image={imageUri}
                  width={350}
                  height={350}
                  border={30}
                  color={[255, 255, 255, 0.6]}
                  scale={imageScale}
                />
                <Slider
                  className="rc-slider"
                  defaultValue={50}
                  onChange={value => setImageScale(value / 100 + 0.5)}
                />
              </div>
            )}
          </div>
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
            primary
            onClick={() =>
              onConfirm(
                EditorRef.current.getImage().toDataURL('image/jpeg', 0.7)
              )
            }
            disabled={processing}
          >
            Submit
          </Button>
        </footer>
      </ErrorBoundary>
    </Modal>
  );
}
