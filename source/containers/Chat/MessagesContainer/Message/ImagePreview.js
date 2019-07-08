import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired
};

export default function ImagePreview({ src, fileName }) {
  const [imageModalShown, setImageModalShown] = useState(false);
  return (
    <div>
      <img
        style={{
          maxWidth: '100%',
          height: '25vw',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
        src={src}
        rel={fileName}
        onClick={() => setImageModalShown(true)}
      />
      {imageModalShown && (
        <Modal large onHide={() => setImageModalShown(false)}>
          <header>{fileName}</header>
          <main>
            <img
              style={{ maxWidth: '100%', objectFit: 'contain' }}
              src={src}
              rel={fileName}
            />
          </main>
          <footer>
            <Button color="orange" onClick={() => window.open(src)}>
              Download
            </Button>
            <Button
              style={{ marginLeft: '1rem' }}
              color="blue"
              onClick={() => setImageModalShown(false)}
            >
              Close
            </Button>
          </footer>
        </Modal>
      )}
    </div>
  );
}
