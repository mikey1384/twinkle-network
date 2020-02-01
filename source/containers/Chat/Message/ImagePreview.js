import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

ImagePreview.propTypes = {
  modalOverModal: PropTypes.bool,
  src: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired
};

export default function ImagePreview({ modalOverModal, src, fileName }) {
  const [imageModalShown, setImageModalShown] = useState(false);
  return (
    <div>
      <img
        style={{
          maxWidth: '100%',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
        className={css`
          height: 25vw;
          @media (max-width: ${mobileMaxWidth}) {
            height: 50vw;
          }
        `}
        src={src}
        rel={fileName}
        onClick={() => setImageModalShown(true)}
      />
      {imageModalShown && (
        <Modal
          modalOverModal={modalOverModal}
          large
          onHide={() => setImageModalShown(false)}
        >
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
