import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImageModal from 'components/Modals/ImageModal';
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
        <ImageModal
          onHide={() => setImageModalShown(false)}
          modalOverModal={modalOverModal}
          fileName={fileName}
          src={src}
        />
      )}
    </div>
  );
}
