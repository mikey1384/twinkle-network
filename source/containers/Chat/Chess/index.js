import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import FallenPieces from './FallenPieces.js';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { initialiseChessBoard, getPositionId } from './helpers/model.js';
import {
  checkerPos,
  getPieceIndex,
  isGameOver,
  isPossibleAndLegal,
  kingWillBeCapturedBy,
  returnBoardAfterMove,
  highlightPossiblePathsFromSrc,
  getOpponentPlayerColor,
  getPlayerPieces
} from './helpers/model';

Chess.propTypes = {
  channelId: PropTypes.number,
  chessCountdownObj: PropTypes.object,
  gameWinnerId: PropTypes.number,
  interactable: PropTypes.bool,
  initialState: PropTypes.string,
  loaded: PropTypes.bool,
  moveViewed: PropTypes.bool,
  myId: PropTypes.number,
  newChessState: PropTypes.string,
  onBoardClick: PropTypes.func,
  onChessMove: PropTypes.func,
  onSpoilerClick: PropTypes.func,
  opponentId: PropTypes.number,
  opponentName: PropTypes.string,
  spoilerOff: PropTypes.bool,
  style: PropTypes.object
};

export default function Chess({
  channelId,
  chessCountdownObj,
  gameWinnerId,
  interactable,
  initialState,
  loaded,
  myId,
  moveViewed,
  newChessState,
  onBoardClick,
  onChessMove,
  onSpoilerClick,
  opponentId,
  opponentName,
  spoilerOff,
  style
}) {
  const [playerColors, setPlayerColors] = useState({
    [myId]: 'white',
    [opponentId]: 'black'
  });
  const [squares, setSquares] = useState([]);
  const [whiteFallenPieces, setWhiteFallenPieces] = useState([]);
  const [blackFallenPieces, setBlackFallenPieces] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [status, setStatus] = useState('');
  const [gameOverMsg, setGameOverMsg] = useState();
  const fallenPieces = useRef({
    white: [],
    black: []
  });
  const enPassantTarget = useRef({});
  const capturedPiece = useRef(null);
  const parsedState = initialState ? JSON.parse(initialState) : undefined;

  useEffect(() => {
    if (newChessState) return;
    const playerColors = parsedState
      ? parsedState.playerColors
      : {
          [myId]: 'white',
          [opponentId]: 'black'
        };
    setPlayerColors(playerColors);
    setSquares(initialiseChessBoard({ initialState, loading: !loaded, myId }));
    if (parsedState) {
      enPassantTarget.current = parsedState.enPassantTarget || {};
      setBlackFallenPieces(parsedState.fallenPieces.black);
      setWhiteFallenPieces(parsedState.fallenPieces.white);
      fallenPieces.current = parsedState.fallenPieces;
    }
    if (interactable && !userMadeLastMove) {
      setSquares(squares =>
        squares.map(square =>
          square.color === playerColors[myId]
            ? {
                ...square,
                state:
                  gameOverMsg ||
                  ['check', 'checkmate'].indexOf(square.state) !== -1
                    ? square.state
                    : 'highlighted'
              }
            : square
        )
      );
    }
  }, [initialState, loaded, newChessState]);

  const move = parsedState?.move;
  const myColor = parsedState?.playerColors[myId] || 'white';
  const userMadeLastMove = move?.by === myId;
  const countdownNumber = chessCountdownObj?.[channelId];
  const isCheck = parsedState?.isCheck;
  const isCheckmate = parsedState?.isCheckmate;
  const isStalemate = parsedState?.isStalemate;
  const statusText = isCheckmate
    ? 'Checkmate'
    : isStalemate
    ? 'Stalemate'
    : isCheck
    ? 'Check'
    : '';

  return (
    <div
      style={{
        position: 'relative',
        padding: '1rem',
        background: Color.subtitleGray(),
        ...style
      }}
    >
      {loaded && parsedState && (
        <div
          style={{
            top: '1rem',
            left: '1rem',
            position: 'absolute',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}
        >
          <p>{userMadeLastMove ? 'You' : opponentName}</p>
          <p>
            {spoilerOff
              ? move?.piece
                ? `moved ${
                    move?.piece?.type === 'king'
                      ? `${userMadeLastMove ? 'your' : 'their'} king`
                      : `a ${move?.piece?.type}`
                  }`
                : 'castled'
              : 'made a move'}
          </p>
          {spoilerOff && (
            <>
              {move?.piece?.type && (
                <>
                  <p>from {move?.from}</p>
                  <p>to {move?.to}</p>
                  {parsedState?.capturedPiece && (
                    <>
                      <p>and captured</p>
                      <p>{userMadeLastMove ? `${opponentName}'s` : 'your'}</p>
                      <p>{parsedState?.capturedPiece}</p>
                    </>
                  )}
                </>
              )}
              {(isCheck || isCheckmate || isStalemate) && (
                <p style={{ marginTop: '2rem' }}>{`${statusText}!`}</p>
              )}
            </>
          )}
        </div>
      )}
      <div
        className={css`
          user-select: none;
          font: 14px 'Century Gothic', Futura, sans-serif;
          .dark {
            background-color: ${Color.orange()};
          }

          .dark.highlighted {
            background-color: RGB(164, 236, 137);
          }

          .dark.check {
            background-color: yellow;
          }

          .dark.danger {
            background-color: yellow;
          }

          .dark.checkmate {
            background-color: red;
          }

          .light {
            background-color: RGB(234, 240, 206);
          }

          .light.highlighted {
            background-color: RGB(174, 255, 196);
          }

          .light.check {
            background-color: yellow;
          }

          .light.danger {
            background-color: yellow;
          }

          .light.checkmate {
            background-color: red;
          }
        `}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              height: '4.5rem',
              display: 'flex',
              flexDirection: 'column',
              margin: '1rem 0'
            }}
          >
            {loaded && spoilerOff && (
              <FallenPieces
                myColor={myColor}
                {...{
                  [myColor === 'white'
                    ? 'whiteFallenPieces'
                    : 'blackFallenPieces']:
                    myColor === 'white' ? whiteFallenPieces : blackFallenPieces
                }}
              />
            )}
          </div>
          <Board
            loading={!loaded}
            spoilerOff={spoilerOff || !!gameWinnerId}
            initialState={initialState}
            interactable={interactable && !newChessState && !userMadeLastMove}
            squares={squares}
            myColor={myColor}
            onClick={handleClick}
            onBoardClick={onBoardClick}
            onCastling={handleCastling}
            onSpoilerClick={onSpoilerClick}
            opponentName={opponentName}
          />
          <div
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                height: '4.5rem',
                display: 'flex',
                flexDirection: 'column',
                margin: '1rem 0'
              }}
            >
              {loaded && spoilerOff && (
                <FallenPieces
                  myColor={myColor}
                  {...{
                    [myColor === 'white'
                      ? 'blackFallenPieces'
                      : 'whiteFallenPieces']:
                      myColor === 'white'
                        ? blackFallenPieces
                        : whiteFallenPieces
                  }}
                />
              )}
            </div>
            {(status || gameOverMsg) && (
              <div style={{ fontSize: '2rem', paddingBottom: '1rem' }}>
                {status || gameOverMsg}
              </div>
            )}
          </div>
        </div>
      </div>
      {((loaded && userMadeLastMove && !moveViewed) || !!countdownNumber) && (
        <div
          style={{
            bottom: '1rem',
            right: '1rem',
            position: 'absolute',
            fontSize:
              countdownNumber && countdownNumber <= 10 ? '3.5rem' : '2.5rem',
            fontWeight: 'bold',
            color: countdownNumber && countdownNumber <= 10 ? 'red' : ''
          }}
        >
          {countdownNumber || (
            <>
              <p>Awaiting</p>
              <p>{`${opponentName}'s move`}</p>
            </>
          )}
        </div>
      )}
    </div>
  );

  function handleCastling(direction) {
    const actualSquares = squares.map(square => (square.isPiece ? square : {}));
    const { playerPieces } = getPlayerPieces({
      color: getOpponentPlayerColor(myColor),
      squares: actualSquares
    });
    let kingPos = getPieceIndex({
      color: myColor,
      squares: actualSquares,
      type: 'king'
    });
    let rookPos = -1;
    let kingMidDest = -1;
    let kingEndDest = -1;

    if (direction === 'right') {
      rookPos = 63;
      if (myColor === 'white') {
        kingMidDest = 61;
        kingEndDest = 62;
      } else {
        kingMidDest = 60;
        kingEndDest = 61;
      }
    } else {
      rookPos = 56;
      if (myColor === 'white') {
        kingMidDest = 59;
        kingEndDest = 58;
      } else {
        kingMidDest = 58;
        kingEndDest = 57;
      }
    }

    for (let piece of playerPieces) {
      if (
        isPossibleAndLegal({
          src: piece.index,
          dest: kingMidDest,
          squares: actualSquares,
          myColor
        })
      ) {
        setSquares(
          actualSquares.map((square, index) => {
            if (index === piece.index) {
              return {
                ...square,
                state: 'danger'
              };
            }
            return {
              ...square,
              state: square.state === 'danger' ? '' : square.state
            };
          })
        );
        setStatus(
          `Castling not allowed because the king cannot pass through a square that is attacked by an enemy piece`
        );
        return;
      }
    }
    const rookDest = kingMidDest;
    const newSquares = returnBoardAfterMove({
      squares: returnBoardAfterMove({
        squares: actualSquares,
        src: kingPos,
        dest: kingEndDest,
        myColor
      }),
      src: rookPos,
      dest: rookDest,
      myColor
    });
    const { moved } = processResult({
      myKingIndex: kingEndDest,
      newSquares
    });
    if (moved) {
      handleMove({ newSquares });
    }
  }

  function handleClick(i) {
    if (!interactable || newChessState || userMadeLastMove) return;
    if (selectedIndex === -1) {
      if (!squares[i] || squares[i].color !== myColor) {
        return;
      }
      setSquares(squares =>
        highlightPossiblePathsFromSrc({
          color: myColor,
          squares,
          src: i,
          enPassantTarget: enPassantTarget.current,
          myColor
        })
      );
      setStatus('');
      setSelectedIndex(i);
    } else {
      if (squares[i] && squares[i].color === myColor) {
        setSelectedIndex(i);
        setStatus('');
        setSquares(squares =>
          highlightPossiblePathsFromSrc({
            color: myColor,
            squares,
            src: i,
            myColor
          })
        );
      } else {
        if (
          isPossibleAndLegal({
            src: selectedIndex,
            dest: i,
            squares,
            enPassantTarget: enPassantTarget.current,
            myColor
          })
        ) {
          const newSquares = returnBoardAfterMove({
            squares,
            src: selectedIndex,
            dest: i,
            myColor,
            enPassantTarget: enPassantTarget.current
          });
          const myKingIndex = getPieceIndex({
            color: myColor,
            squares: newSquares,
            type: 'king'
          });
          const { moved, isCheck, isCheckmate, isStalemate } = processResult({
            myKingIndex,
            newSquares,
            dest: i,
            src: selectedIndex
          });
          if (moved) {
            handleMove({
              newSquares,
              dest: i,
              isCheck,
              isCheckmate,
              isStalemate
            });
          }
        }
      }
    }
  }

  function handleMove({ newSquares, dest, isCheck, isCheckmate, isStalemate }) {
    const moveDetail =
      typeof dest === 'number'
        ? {
            piece: {
              ...squares[selectedIndex],
              state: 'blurred',
              isPiece: false
            },
            from: getPositionId({ index: selectedIndex, myColor }),
            to: getPositionId({ index: dest, myColor }),
            srcIndex: myColor === 'black' ? 63 - selectedIndex : selectedIndex
          }
        : {};
    const json = JSON.stringify({
      move: {
        by: myId,
        ...moveDetail
      },
      capturedPiece: capturedPiece.current?.type,
      playerColors: playerColors || {
        [myId]: 'white',
        [opponentId]: 'black'
      },
      board: (myColor === 'black'
        ? newSquares.map(
            (square, index) => newSquares[newSquares.length - 1 - index]
          )
        : newSquares
      ).map(square =>
        square.state === 'highlighted' ? { ...square, state: '' } : square
      ),
      fallenPieces: fallenPieces.current,
      enPassantTarget: enPassantTarget.current,
      isCheck,
      isCheckmate,
      isStalemate
    });
    onChessMove(json);
  }

  function processResult({ myKingIndex, newSquares, dest, src }) {
    let isCheck = false;
    const newWhiteFallenPieces = [...whiteFallenPieces];
    const newBlackFallenPieces = [...blackFallenPieces];
    const potentialCapturers = kingWillBeCapturedBy({
      kingIndex: myKingIndex,
      myColor,
      squares: newSquares
    });
    if (potentialCapturers.length > 0) {
      setSquares(squares =>
        squares.map((square, index) => {
          if (potentialCapturers.indexOf(index) !== -1) {
            return {
              ...square,
              state: 'danger'
            };
          }
          return {
            ...square,
            state: square.state === 'danger' ? '' : square.state
          };
        })
      );
      setStatus('Your King will be captured if you make that move.');
      return {};
    }
    if (dest) {
      if (squares[src].type === 'pawn') {
        if (enPassantTarget.current) {
          const srcRow = Math.floor(src / 8);
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          const attacking = srcRow - destRow === 1;
          const enPassanting =
            !squares[dest].color &&
            attacking &&
            enPassantTarget.current % 8 === destColumn;
          if (enPassanting) {
            myColor === 'white'
              ? newBlackFallenPieces.push(squares[enPassantTarget.current])
              : newWhiteFallenPieces.push(squares[enPassantTarget.current]);
            capturedPiece.current = squares[enPassantTarget.current];
          }
        }
      }
      if (squares[dest].isPiece) {
        squares[dest].color === 'white'
          ? newWhiteFallenPieces.push(squares[dest])
          : newBlackFallenPieces.push(squares[dest]);
        capturedPiece.current = squares[dest];
      }
    }
    setSelectedIndex(-1);
    const theirKingIndex = getPieceIndex({
      color: getOpponentPlayerColor(myColor),
      squares: newSquares,
      type: 'king'
    });
    if (
      checkerPos({
        squares: newSquares,
        kingIndex: theirKingIndex,
        myColor
      }).length !== 0
    ) {
      newSquares[theirKingIndex] = {
        ...newSquares[theirKingIndex],
        state: 'check'
      };
      isCheck = true;
    }
    if (dest) {
      newSquares[dest].moved = true;
    }
    setSquares(newSquares);
    setWhiteFallenPieces(newWhiteFallenPieces);
    setBlackFallenPieces(newBlackFallenPieces);
    fallenPieces.current = {
      white: newWhiteFallenPieces,
      black: newBlackFallenPieces
    };
    setStatus('');
    const gameOver = isGameOver({
      squares: newSquares,
      enPassantTarget,
      myColor
    });
    if (gameOver) {
      if (gameOver === 'Checkmate') {
        setSquares(squares =>
          squares.map((square, index) =>
            index === theirKingIndex
              ? { ...square, state: 'checkmate' }
              : square
          )
        );
      }
      setGameOverMsg(gameOver);
    }
    const target =
      newSquares[dest]?.type === 'pawn' && dest === src - 16 ? 63 - dest : null;
    enPassantTarget.current = target;
    return {
      moved: true,
      isCheck,
      isCheckmate: gameOver === 'Checkmate',
      isStalemate: gameOver === 'Stalemate'
    };
  }
}
