import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import getPiece from './helpers/piece';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

Board.propTypes = {
  initialState: PropTypes.string,
  interactable: PropTypes.bool,
  loading: PropTypes.bool,
  status: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  squares: PropTypes.array.isRequired,
  myColor: PropTypes.string.isRequired,
  onCastling: PropTypes.func.isRequired,
  spoilerOff: PropTypes.bool,
  opponentName: PropTypes.string,
  onBoardClick: PropTypes.func,
  onSpoilerClick: PropTypes.func
};

export default function Board({
  initialState,
  interactable,
  loading,
  status,
  onClick,
  squares,
  myColor,
  onBoardClick,
  onCastling,
  onSpoilerClick,
  opponentName,
  spoilerOff
}) {
  const [board, setBoard] = useState();
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  if (myColor === 'black') letters.reverse();
  useEffect(() => {
    if (spoilerOff) {
      const board = [];
      for (let i = 0; i < 8; i++) {
        const squareRows = [];
        for (let j = 0; j < 8; j++) {
          const index = i * 8 + j;
          squareRows.push(
            <Square
              key={index}
              className={squares[index]?.state}
              img={
                squares[index]
                  ? getPiece({ piece: squares[index], myColor, interactable })
                      .img
                  : undefined
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

      setBoard(
        <>
          <div
            style={{
              gridArea: 'num',
              display: 'grid',
              gridTemplateRows: 'repeat(8, 1fr)'
            }}
          >
            {Array(8)
              .fill()
              .map((elem, index) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  key={index}
                >
                  {myColor === 'black' ? 8 - index : index + 1}
                </div>
              ))}
          </div>
          <div
            style={{
              gridArea: 'chess',
              position: 'relative'
            }}
          >
            <div
              style={{
                margin: '0 auto',
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)'
              }}
            >
              {board}
            </div>
          </div>
          {squares.length > 0 && renderCastlingButtons()}
          <div
            style={{
              gridArea: 'letter',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)'
            }}
          >
            {letters.map((elem, index) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                key={index}
              >
                {elem}
              </div>
            ))}
          </div>
        </>
      );
    } else if (spoilerOff === false) {
      setBoard(
        <>
          <div
            style={{
              margin: '0 auto',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: '1.7rem',
              lineHeight: 2
            }}
          >
            <div
              className={css`
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              `}
              onClick={onSpoilerClick}
            >
              <p>{opponentName} made a new chess move.</p>
              <p>Tap here to view it.</p>
              <p>
                {`After viewing ${opponentName}'s move, you `}
                <b>must</b> make your own move in <b>one minute</b>. Otherwise,
                you will lose.
              </p>
            </div>
          </div>
        </>
      );
    } else setBoard(null);

    return function cleanUp() {
      setBoard(null);
    };
  }, [interactable, spoilerOff, squares]);

  return (
    <div
      className={css`
        width: CALC(360px + 2rem);
        height: CALC(360px + 2.5rem);
        position: relative;
        @media (max-width: ${mobileMaxWidth}) {
          width: CALC(180px + 2rem);
          height: CALC(180px + 2.5rem);
        }
      `}
    >
      {loading ? (
        <Loading />
      ) : squares.length > 0 ? (
        <div
          onClick={spoilerOff ? onBoardClick : undefined}
          className={css`
            cursor: ${spoilerOff && onBoardClick ? 'pointer' : ''};
            display: grid;
            grid-template-areas:
              'chess num'
              'letter .';
            grid-template-columns: 360px 2rem;
            grid-template-rows: 360px 2.5rem;
            background: ${spoilerOff ? '#fff' : ''};
            @media (max-width: ${mobileMaxWidth}) {
              grid-template-columns: 180px 2rem;
              grid-template-rows: 180px 2.5rem;
            }
          `}
        >
          {board}
        </div>
      ) : null}
    </div>
  );

  function renderCastlingButtons() {
    const top = 'CALC(100% - 6rem)';
    return myColor === 'white' ? (
      <>
        {interactable &&
          !squares[57].isPiece &&
          !squares[58].isPiece &&
          !squares[59].isPiece &&
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
                left: '69px',
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
        {interactable &&
          !squares[61].isPiece &&
          !squares[62].isPiece &&
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
                left: '226px',
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
        {interactable &&
          !squares[57].isPiece &&
          !squares[58].isPiece &&
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
                left: '46px',
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
        {interactable &&
          !squares[60].isPiece &&
          !squares[61].isPiece &&
          !squares[62].isPiece &&
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
