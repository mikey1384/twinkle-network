import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { useMyState } from 'helpers/hooks';

AddButtons.propTypes = {
  disabled: PropTypes.bool,
  onUploadButtonClick: PropTypes.func.isRequired
};

export default function AddButtons({ disabled, onUploadButtonClick }) {
  const { profileTheme } = useMyState();
  return (
    <div
      style={{
        display: 'flex',
        margin: '0.2rem 0 0.2rem 0',
        height: '100%'
      }}
    >
      <Button
        skeuomorphic
        disabled={disabled}
        onClick={onUploadButtonClick}
        color={profileTheme}
      >
        <Icon size="lg" icon="upload" />
      </Button>
      <Button
        skeuomorphic
        disabled={disabled}
        color={profileTheme}
        style={{ marginLeft: '1rem' }}
      >
        <Icon size="lg" icon="film" />
      </Button>
    </div>
  );
}
