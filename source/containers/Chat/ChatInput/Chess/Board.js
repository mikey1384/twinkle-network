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
    const top = 'CALC(100% - 3.5rem)';
    return myColor === 'white' ? (
      <>
        {!castled.left &&
          !squares[57].color &&
          !squares[58].color &&
          !squares[59].color &&
          squares[56].type === 'rook' &&
          !squares[7].moved &&
          squares[60].type === 'king' &&
          squares[60].state !== 'check' &&
          squares[60].state !== 'checkmate' &&
          !squares[60].moved && (
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                background: 'RGB(255, 255, 255, 0.7)',
                top,
                left: '68px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('left')}
            >
              ←{' '}
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                alt=""
              />
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                alt=""
              />{' '}
              →
            </div>
          )}
        {!castled.right &&
          !squares[61].color &&
          !squares[62].color &&
          squares[63].type === 'rook' &&
          !squares[63].moved &&
          squares[60].type === 'king' &&
          squares[60].state !== 'check' &&
          squares[60].state !== 'checkmate' &&
          !squares[60].moved && (
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                background: 'RGB(255, 255, 255, 0.7)',
                top,
                left: '225px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('right')}
            >
              ←{' '}
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                alt=""
              />
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                alt=""
              />{' '}
              →
            </div>
          )}
      </>
    ) : (
      <>
        {!castled.left &&
          !squares[57].color &&
          !squares[58].color &&
          squares[56].type === 'rook' &&
          !squares[56].moved &&
          squares[59].type === 'king' &&
          squares[59].state !== 'check' &&
          squares[59].state !== 'checkmate' &&
          !squares[59].moved && (
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                background: 'RGB(255, 255, 255, 0.7)',
                top,
                left: '45px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('left')}
            >
              ←{' '}
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                alt=""
              />
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                alt=""
              />{' '}
              →
            </div>
          )}
        {!castled.right &&
          !squares[60].color &&
          !squares[61].color &&
          !squares[62].color &&
          squares[63].type === 'rook' &&
          !squares[63].moved &&
          squares[59].type === 'king' &&
          squares[59].state !== 'check' &&
          squares[59].state !== 'checkmate' &&
          !squares[59].moved && (
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                background: 'RGB(255, 255, 255, 0.7)',
                top,
                left: '203px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('right')}
            >
              ←{' '}
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                alt=""
              />
              <img
                style={{ width: '2.5rem', height: '2.5rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
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
