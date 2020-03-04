import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

GameOverMessage.propTypes = {
  opponentName: PropTypes.string,
  myId: PropTypes.number.isRequired,
  winnerId: PropTypes.number.isRequired
};

function GameOverMessage({ myId, opponentName, winnerId }) {
  return (
    <ErrorBoundary>
      <div
        style={{
          marginRight: '1rem',
          paddingBottom: '1rem'
        }}
      >
        <div
          className={css`
            background: ${myId === winnerId
              ? Color.brownOrange()
              : Color.black()};
            font-size: 2.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            color: #fff;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.7rem;
            }
          `}
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

export default memo(GameOverMessage);
