import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import FallenPieces from './FallenPieces.js';
import { initialiseChessBoard } from './helpers/model.js';
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
  myColor: PropTypes.string.isRequired
};

export default function Chess({ myColor }) {
  const [squares, setSquares] = useState(initialiseChessBoard(myColor));
  const [whiteFallenPieces, setWhiteFallenPieces] = useState([]);
  const [blackFallenPieces, setBlackFallenPieces] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [status, setStatus] = useState('');
  const [gameOverMsg, setGameOverMsg] = useState();
  const [enPassantTarget, setEnPassantTarget] = useState({});
  const [blackCastled, setBlackCastled] = useState({
    left: false,
    right: false
  });
  const [whiteCastled, setWhiteCastled] = useState({
    left: false,
    right: false
  });

  useEffect(() => {
    setSquares(squares =>
      squares.map(square =>
        square.color === myColor
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
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <FallenPieces myColor={myColor} whiteFallenPieces={whiteFallenPieces} />
        <Board
          squares={squares}
          myColor={myColor}
          onClick={handleClick}
          onCastling={handleCastling}
          blackCastled={blackCastled}
          whiteCastled={whiteCastled}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ lineHeight: 2 }}>{status || gameOverMsg}</div>
          <FallenPieces
            myColor={myColor}
            blackFallenPieces={blackFallenPieces}
          />
        </div>
      </div>
    </div>
  );

  function handleCastling(direction) {
    const { playerPieces } = getPlayerPieces({
      color: myColor,
      squares
    });
    let kingPos = getPieceIndex({ color: myColor, squares, type: 'king' });
    let rookPos = -1;
    let kingMidDest = -1;
    let kingEndDest = -1;

    if (myColor === 'white') {
      if (direction === 'right') {
        kingMidDest = 61;
        kingEndDest = 62;
        rookPos = 63;
      } else {
        kingMidDest = 59;
        kingEndDest = 58;
        rookPos = 56;
      }
    } else {
      if (direction === 'right') {
        kingMidDest = 5;
        kingEndDest = 6;
        rookPos = 7;
      } else {
        kingMidDest = 3;
        kingEndDest = 2;
        rookPos = 0;
      }
    }
    for (let piece of playerPieces) {
      if (
        isPossibleAndLegal({
          src: piece.index,
          dest: kingMidDest,
          squares,
          color: myColor,
          myColor
        })
      ) {
        setSquares(squares =>
          squares.map((square, index) => {
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
        squares,
        src: kingPos,
        dest: kingEndDest,
        myColor
      }),
      src: rookPos,
      dest: rookDest,
      myColor
    });
    if (handleMove({ myKingIndex: kingEndDest, newSquares }) === 'success') {
      if (myColor === 'white') {
        setWhiteCastled(castled => ({ ...castled, [direction]: true }));
      } else {
        setBlackCastled(castled => ({ ...castled, [direction]: true }));
      }
    }
  }

  function handleClick(i) {
    if (selectedIndex === -1) {
      if (!squares[i] || squares[i].color !== myColor) {
        return;
      }
      setSquares(squares =>
        highlightPossiblePathsFromSrc({
          color: myColor,
          squares,
          src: i,
          enPassantTarget,
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
            color: myColor,
            enPassantTarget,
            myColor
          })
        ) {
          const newSquares = returnBoardAfterMove({
            squares,
            src: selectedIndex,
            dest: i,
            myColor,
            enPassantTarget
          });
          const myKingIndex = getPieceIndex({
            color: myColor,
            squares: newSquares,
            type: 'king'
          });
          handleMove({ myKingIndex, newSquares, dest: i, src: selectedIndex });
        }
      }
    }
  }

  function handleMove({ myKingIndex, newSquares, dest, src }) {
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
      return;
    }
    if (dest) {
      if (squares[src].type === 'pawn') {
        if (enPassantTarget && enPassantTarget.color) {
          const srcRow = Math.floor(src / 8);
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          const attacking = srcRow - destRow === 1;
          const enPassanting =
            !squares[dest].color &&
            enPassantTarget.color !== myColor &&
            attacking &&
            enPassantTarget.index % 8 === destColumn;
          if (enPassanting) {
            enPassantTarget.color === 'white'
              ? newWhiteFallenPieces.push(squares[enPassantTarget.index])
              : newBlackFallenPieces.push(squares[enPassantTarget.index]);
          }
        }
      }
      if (squares[dest].color) {
        squares[dest].color === 'white'
          ? newWhiteFallenPieces.push(squares[dest])
          : newBlackFallenPieces.push(squares[dest]);
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
    }
    if (dest) {
      newSquares[dest].moved = true;
    }
    setSquares(newSquares);
    setWhiteFallenPieces(newWhiteFallenPieces);
    setBlackFallenPieces(newBlackFallenPieces);
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
      newSquares[dest].type === 'pawn' &&
      (dest === src + 16 || dest === src - 16)
        ? { index: dest, color: newSquares[dest].color }
        : {};
    setEnPassantTarget(target);
    return 'success';
  }
}
