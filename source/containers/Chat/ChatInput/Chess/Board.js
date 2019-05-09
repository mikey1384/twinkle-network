import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import getPiece from './helpers/piece';
import { css } from 'emotion';

Board.propTypes = {
  blackCastled: PropTypes.object,
  status: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  player: PropTypes.number.isRequired,
  squares: PropTypes.array.isRequired,
  turn: PropTypes.string.isRequired,
  onCastling: PropTypes.func.isRequired,
  whiteCastled: PropTypes.object
};

export default function Board({
  blackCastled,
  whiteCastled,
  status,
  onClick,
  squares,
  turn,
  onCastling,
  player
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
          style={
            squares[index].player
              ? {
                  ...getPiece(squares[index]).style,
                  cursor:
                    player === squares[index].player ||
                    squares[index].state === 'highlighted' ||
                    squares[index].state === 'check'
                      ? 'pointer'
                      : 'default'
                }
              : getPiece(squares[index]).style
          }
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
        width: '480px',
        height: '480px',
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
        {!blackCastled.left &&
          turn === 'black' &&
          !squares[1].player &&
          !squares[2].player &&
          !squares[3].player &&
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
                top: '13px',
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
        {!blackCastled.right &&
          turn === 'black' &&
          !squares[5].player &&
          !squares[6].player &&
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
                top: '13px',
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
        {!whiteCastled.left &&
          turn === 'white' &&
          !squares[57].player &&
          !squares[58].player &&
          !squares[59].player &&
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
                top: '435px',
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
                src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                alt=""
              />
              <img
                style={{ width: '2rem', height: '2rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                alt=""
              />{' '}
              →
            </div>
          )}
        {!whiteCastled.right &&
          turn === 'white' &&
          !squares[61].player &&
          !squares[62].player &&
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
                top: '435px',
                left: '305px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.5rem 0 0.5rem'
              }}
              onClick={() => onCastling('right')}
            >
              ←{' '}
              <img
                style={{ width: '2rem', height: '2rem' }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                alt=""
              />
              <img
                style={{ width: '2rem', height: '2rem' }}
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
