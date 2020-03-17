import React from 'react';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { useAppContext } from 'contexts';

export default function PleaseLogIn() {
  const {
    user: {
      actions: { onOpenSigninModal }
    }
  } = useAppContext();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: '#fff',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          color: Color.black(),
          textAlign: 'center',
          fontSize: '3rem',
          marginTop: '-5rem'
        }}
      >
        <p>
          Do you want to{' '}
          <span style={{ color: Color.vantaBlack(), fontWeight: 'bold' }}>
            chat
          </span>{' '}
          and play{' '}
          <span style={{ color: Color.vantaBlack(), fontWeight: 'bold' }}>
            vocabulary games & chess
          </span>{' '}
          with{' '}
          <span style={{ color: Color.logoBlue(), fontWeight: 'bold' }}>
            Twin
          </span>
          <span style={{ color: Color.logoGreen(), fontWeight: 'bold' }}>
            kle
          </span>{' '}
          students and teachers?
        </p>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Button
          filled
          color="green"
          style={{ fontSize: '3rem' }}
          onClick={onOpenSigninModal}
        >
          Log In
        </Button>
      </div>
    </div>
  );
}
