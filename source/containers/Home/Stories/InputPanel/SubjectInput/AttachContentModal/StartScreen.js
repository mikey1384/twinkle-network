import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

StartScreen.propTypes = {
  navigateTo: PropTypes.func.isRequired
};

export default function StartScreen({ navigateTo }) {
  return (
    <div
      style={{
        justifyContent: 'center',
        display: 'flex'
      }}
    >
      <Button
        style={{ fontSize: '2rem' }}
        logo
        onClick={() => navigateTo('selectVideo')}
      >
        Video
      </Button>
      <Button
        style={{ fontSize: '2rem', marginLeft: '1rem' }}
        love
        onClick={() => navigateTo('selectLink')}
      >
        Webpage
      </Button>
    </div>
  );
}
