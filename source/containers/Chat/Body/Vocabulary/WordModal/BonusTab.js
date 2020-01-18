import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

BonusTab.propTypes = {
  onHide: PropTypes.func.isRequired,
  word: PropTypes.string.isRequired
};

export default function BonusTab({ word, onHide }) {
  return (
    <>
      <main>
        <div>
          <p
            style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
          >{`Is this a correct definition of "${word}" in it`}</p>
        </div>
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </>
  );
}
