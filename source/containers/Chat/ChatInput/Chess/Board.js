import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import getPiece from './helpers/piece';
import { css } from 'emotion';

Board.propTypes = {
  castled: PropTypes.object,
  status: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  squares: PropTypes.array.isRequired,
  myColor: PropTypes.string.isRequired,
  onCastling: PropTypes.func.isRequired
};

export default function Board({
  castled,
  status,
  onClick,
  squares,
  myColor,
  onCastling
}) {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const squareRows = [];
    for (let j = 0; j < 8; j++) {
      const index = i * 8 + j;
      squareRows.push(
        <Square
          key={index}
          className={squares[index].state}
          style={getPiece({ piece: squares[index], myColor }).style}
          shade={
            (isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))
              ? 'light'
              : 'dark'
          }
          onClick={() => onClick(index)}
        />
      );
    }
    board.push(<Fragment key={i}>{squareRows}</Fragment>);
  }
  return (
    <div
      style={{
        width: '360px',
        height: '360px',
        position: 'relative'
      }}
    >
      <div
        className={css`
          margin: 0 auto;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
        `}
      >
        {board}
      </div>
      {renderCastlingButtons()}
    </div>
  );

  function renderCastlingButtons() {
    return (
      <>
        {!castled.left &&
          myColor === 'black' &&
          !squares[1].color &&
          !squares[2].color &&
          !squares[3].color &&
          squares[0].type === 'rook' &&
          !squares[0].moved &&
          squares[4].type === 'king' &&
          squares[4].state !== 'check' &&
          squares[4].state !== 'checkmate' &&
          !squares[4].moved && (
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                background: 'RGB(255, 255, 255, 0.7)',
                top: 0,
                left: '95px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('left')}
            >
              ←{' '}
              <img
                style={{ width: '2rem', height: '2rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
                alt=""
              />{' '}
              <img
                style={{ width: '2rem', height: '2rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"
                alt=""
              />
              →
            </div>
          )}
        {!castled.right &&
          myColor === 'black' &&
          !squares[5].color &&
          !squares[6].color &&
          squares[7].type === 'rook' &&
          !squares[7].moved &&
          squares[4].type === 'king' &&
          squares[4].state !== 'check' &&
          squares[4].state !== 'checkmate' &&
          !squares[4].moved && (
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                background: 'RGB(255, 255, 255, 0.7)',
                top: 0,
                right: '65px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('right')}
            >
              ←{' '}
              <img
                style={{ width: '2rem', height: '2rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"
                alt=""
              />
              <img
                style={{ width: '2rem', height: '2rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
                alt=""
              />{' '}
              →
            </div>
          )}
      </>
    );
  }
}

function isEven(num) {
  return num % 2 === 0;
}
