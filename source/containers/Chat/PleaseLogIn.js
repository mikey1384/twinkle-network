import React from 'react';
import Button from 'components/Button';
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
          textAlign: 'center',
          fontSize: '3rem',
          fontWeight: 'bold',
          marginTop: '-5rem'
        }}
      >
        <p>To chat and play chess with Twinkle students and teachers:</p>
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
