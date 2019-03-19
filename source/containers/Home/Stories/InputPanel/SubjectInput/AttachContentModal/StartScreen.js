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
        color="logoBlue"
        onClick={() => navigateTo('selectVideo')}
      >
        Video
      </Button>
      <Button
        style={{ fontSize: '2rem', marginLeft: '1rem' }}
        color="pink"
        onClick={() => navigateTo('selectLink')}
      >
        Webpage
      </Button>
    </div>
  );
}
