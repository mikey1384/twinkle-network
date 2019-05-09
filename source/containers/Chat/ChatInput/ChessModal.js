import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Chess from './Chess';
import { css } from 'emotion';

ChessModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function ChessModal({ onHide }) {
  return (
    <Modal large onHide={onHide}>
      <header>Chess</header>
      <main
        className={css`
          font: 14px 'Century Gothic', Futura, sans-serif;
          margin: 20px;
          background-color: #b4b4b4;

          .dark {
            background-color: RGB(104, 136, 107);
          }

          .dark.highlighted {
            background-color: RGB(164, 236, 137);
          }

          .dark.check {
            background-color: yellow;
          }

          .dark.danger {
            background-color: yellow;
          }

          .dark.checkmate {
            background-color: red;
          }

          .light {
            background-color: RGB(234, 240, 206);
          }

          .light.highlighted {
            background-color: RGB(174, 255, 196);
          }

          .light.check {
            background-color: yellow;
          }

          .light.danger {
            background-color: yellow;
          }

          .light.checkmate {
            background-color: red;
          }
        `}
      >
        <Chess myColor="white" />
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
      </footer>
    </Modal>
  );
}
