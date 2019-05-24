import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';

GameOverMessage.propTypes = {
  opponentName: PropTypes.string,
  myId: PropTypes.number.isRequired,
  winnerId: PropTypes.number.isRequired
};

export default function GameOverMessage({ myId, opponentName, winnerId }) {
  return (
    <ErrorBoundary>
      <div
        style={{
          marginRight: '1rem',
          paddingBottom: '1rem'
        }}
      >
        <div
          style={{
            background: myId === winnerId ? Color.brownOrange() : Color.black(),
            fontSize: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            color: '#fff'
          }}
        >
          {myId === winnerId ? (
            <div style={{ textAlign: 'center' }}>
              <p>{opponentName} failed to make a move in time...</p>
              <p style={{ fontWeight: 'bold' }}>You win!</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p>You failed to make a move in time...</p>
              <p>{opponentName} wins</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
