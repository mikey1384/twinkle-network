import React, { memo, Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import getPiece from './helpers/piece';
import Loading from 'components/Loading';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

Board.propTypes = {
  interactable: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  squares: PropTypes.array.isRequired,
  myColor: PropTypes.string.isRequired,
  onCastling: PropTypes.func.isRequired,
  spoilerOff: PropTypes.bool,
  opponentName: PropTypes.string,
  onBoardClick: PropTypes.func,
  onSpoilerClick: PropTypes.func
};

function Board({
  interactable,
  loading,
  onClick,
  squares,
  myColor,
  onBoardClick,
  onCastling,
  onSpoilerClick,
  opponentName,
  spoilerOff
}) {
  const board = useMemo(() => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    function isEven(num) {
      return num % 2 === 0;
    }
    if (myColor === 'black') letters.reverse();
    if (spoilerOff) {
      const board = [];
      for (let i = 0; i < 8; i++) {
        const squareRows = [];
        for (let j = 0; j < 8; j++) {
          const index = i * 8 + j;
          const piece = squares[index]
            ? getPiece({ piece: squares[index], myColor, interactable })
            : {};
          squareRows.push(
            <Square
              key={index}
              className={squares[index]?.state}
              img={piece.img}
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
          onClick={spoilerOff ? onBoardClick : undefined}
          className={css`
            cursor: ${spoilerOff && onBoardClick ? 'pointer' : ''};
            display: ${spoilerOff === false ? 'flex' : 'grid'};
            align-items: ${spoilerOff === false ? 'center' : ''};
            width: 100%;
            height: 100%;
            grid-template-areas:
              'num chess'
              '. letter';
            grid-template-columns: 2rem 360px;
            grid-template-rows: 360px 2.5rem;
            background: ${spoilerOff ? '#fff' : ''};
            @media (max-width: ${mobileMaxWidth}) {
              grid-template-columns: 2rem 50vw;
              grid-template-rows: 50vw 2.5rem;
            }
          `}
        >
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
                  {myColor === 'black' ? index + 1 : 8 - index}
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
        </div>
      );
    } else if (spoilerOff === false) {
      return (
        <div
          onClick={spoilerOff ? onBoardClick : undefined}
          className={css`
            cursor: ${spoilerOff && onBoardClick ? 'pointer' : ''};
            display: ${spoilerOff === false ? 'flex' : 'grid'};
            align-items: ${spoilerOff === false ? 'center' : ''};
            width: 100%;
            height: 100%;
            grid-template-areas:
              'num chess'
              '. letter';
            grid-template-columns: 2rem 360px;
            grid-template-rows: 360px 2.5rem;
            background: ${spoilerOff ? '#fff' : ''};
            @media (max-width: ${mobileMaxWidth}) {
              grid-template-columns: 2rem 50vw;
              grid-template-rows: 50vw 2.5rem;
            }
          `}
        >
          <div
            className={css`
              margin: 0 auto;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
              text-align: center;
              font-size: 1.7rem;
              line-height: 2;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 1.5rem;
              }
            `}
          >
            <div
              className={css`
                cursor: pointer;
                background: #fff;
                border: 1px solid ${Color.darkGray()};
                padding: 1rem;
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
                <b>must</b> make your own move in <b>3 minutes</b>. Otherwise,
                you will lose.
              </p>
            </div>
          </div>
        </div>
      );
    } else return null;

    function renderCastlingButtons() {
      const top = 'CALC(100% - 6rem)';
      const mobileTop = 'CALC(50vw + 0.5rem)';
      const mobileCastlingBackgroundColor = Color.pink(0.7);
      return myColor === 'white' ? (
        <>
          {interactable &&
            !squares[57].isPiece &&
            !squares[58].isPiece &&
            !squares[59].isPiece &&
            squares[56].type === 'rook' &&
            !squares[56].moved &&
            squares[60].type === 'king' &&
            squares[60].state !== 'check' &&
            squares[60].state !== 'checkmate' &&
            !squares[60].moved && (
              <div
                className={css`
                  cursor: pointer;
                  position: absolute;
                  background: RGB(255, 255, 255, 0.7);
                  top: ${top};
                  left: 89px;
                  display: flex;
                  align-items: center;
                  padding: 0 0.5rem 0 0.5rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    background: ${mobileCastlingBackgroundColor};
                    font-size: 1rem;
                    left: 0;
                    top: ${mobileTop};
                  }
                `}
                onClick={() => onCastling('left')}
              >
                ←{' '}
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                  alt=""
                />
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
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
                className={css`
                  cursor: pointer;
                  position: absolute;
                  background: RGB(255, 255, 255, 0.7);
                  top: ${top};
                  left: 246px;
                  display: flex;
                  align-items: center;
                  padding: 0 0.5rem 0 0.5rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    background: ${mobileCastlingBackgroundColor};
                    font-size: 1rem;
                    left: CALC(100% - 7rem);
                    top: ${mobileTop};
                  }
                `}
                onClick={() => onCastling('right')}
              >
                ←{' '}
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
                  src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                  alt=""
                />
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
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
                className={css`
                  cursor: pointer;
                  position: absolute;
                  background: RGB(255, 255, 255, 0.7);
                  top: ${top};
                  left: 66px;
                  display: flex;
                  align-items: center;
                  padding: 0 0.5rem 0 0.5rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    background: ${mobileCastlingBackgroundColor};
                    font-size: 1rem;
                    left: 0;
                    top: ${mobileTop};
                  }
                `}
                onClick={() => onCastling('left')}
              >
                ←{' '}
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                  alt=""
                />
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
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
                className={css`
                  cursor: pointer;
                  position: absolute;
                  background: RGB(255, 255, 255, 0.7);
                  top: ${top};
                  left: 223px;
                  display: flex;
                  align-items: center;
                  padding: 0 0.5rem 0 0.5rem;
                  @media (max-width: ${mobileMaxWidth}) {
                    background: ${mobileCastlingBackgroundColor};
                    font-size: 1rem;
                    left: CALC(100% - 7rem);
                    top: ${mobileTop};
                  }
                `}
                onClick={() => onCastling('right')}
              >
                ←{' '}
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
                  src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
                  alt=""
                />
                <img
                  className={css`
                    width: 2.5rem;
                    height: 2.5rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 2rem;
                      height: 2rem;
                    }
                  `}
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
                  alt=""
                />{' '}
                →
              </div>
            )}
        </>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactable, myColor, opponentName, spoilerOff, squares]);

  return (
    <div
      className={css`
        width: CALC(360px + 2rem);
        height: CALC(360px + 2.5rem);
        position: relative;
        @media (max-width: ${mobileMaxWidth}) {
          width: CALC(50vw + 2rem);
          height: CALC(50vw + 2.5rem);
        }
      `}
    >
      {loading ? <Loading /> : squares.length > 0 ? board : null}
    </div>
  );
}

export default memo(Board);
