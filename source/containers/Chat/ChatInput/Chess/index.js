import React, { useEffect, useState } from 'react';
import Board from './Board';
import FallenPieces from './FallenPieces.js';
import { initialiseChessBoard } from './helpers/model.js';
import {
  checkerPos,
  getPieceIndex,
  getOpponentPlayerId,
  isGameOver,
  isPossibleAndLegal,
  kingWillBeCapturedBy,
  returnBoardAfterMove,
  highlightPossiblePathsFromSrc,
  getPlayerPieces
} from './helpers/model';

export default function Game() {
  const [squares, setSquares] = useState(initialiseChessBoard());
  const [whiteFallenPieces, setWhiteFallenPieces] = useState([]);
  const [blackFallenPieces, setBlackFallenPieces] = useState([]);
  const [player, setPlayer] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [status, setStatus] = useState('');
  const [turn, setTurn] = useState('white');
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
    const players = { white: 1, black: 2 };
    setSquares(squares =>
      squares.map(square =>
        square.player === players[turn]
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
  }, [turn]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <FallenPieces whiteFallenPieces={whiteFallenPieces} />
        <Board
          squares={squares}
          turn={turn}
          onClick={handleClick}
          onCastling={handleCastling}
          player={player}
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
          <FallenPieces blackFallenPieces={blackFallenPieces} />
        </div>
      </div>
    </div>
  );

  function handleCastling(direction) {
    const opponent = getOpponentPlayerId(player);
    const { playerPieces } = getPlayerPieces({
      player: opponent,
      squares
    });
    let kingPos = getPieceIndex({ player, squares, type: 'king' });
    let rookPos = -1;
    let kingMidDest = -1;
    let kingEndDest = -1;

    if (turn === 'white') {
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
          player: opponent
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
        player
      }),
      src: rookPos,
      dest: rookDest,
      player
    });
    if (handleMove({ myKingIndex: kingEndDest, newSquares }) === 'success') {
      if (turn === 'black') {
        setBlackCastled(castled => ({ ...castled, [direction]: true }));
      } else {
        setWhiteCastled(castled => ({ ...castled, [direction]: true }));
      }
    }
  }

  function handleClick(i) {
    if (selectedIndex === -1) {
      if (!squares[i] || squares[i].player !== player) {
        return;
      }
      setSquares(squares =>
        highlightPossiblePathsFromSrc({
          player,
          squares,
          src: i,
          enPassantTarget
        })
      );
      setStatus('');
      setSelectedIndex(i);
    } else {
      if (squares[i] && squares[i].player === player) {
        setSelectedIndex(i);
        setStatus('');
        setSquares(squares =>
          highlightPossiblePathsFromSrc({ player, squares, src: i })
        );
      } else {
        if (
          isPossibleAndLegal({
            src: selectedIndex,
            dest: i,
            squares,
            player,
            enPassantTarget
          })
        ) {
          const newSquares = returnBoardAfterMove({
            squares,
            src: selectedIndex,
            dest: i,
            player,
            enPassantTarget
          });
          const myKingIndex = getPieceIndex({
            player,
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
      player,
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
        if (enPassantTarget && enPassantTarget.player) {
          const srcRow = Math.floor(src / 8);
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          const attacking =
            player === 1 ? srcRow - destRow === 1 : destRow - srcRow === 1;
          const enPassanting =
            !squares[dest].player &&
            enPassantTarget.player !== player &&
            attacking &&
            enPassantTarget.index % 8 === destColumn;
          if (enPassanting) {
            enPassantTarget.player === 1
              ? newWhiteFallenPieces.push(squares[enPassantTarget.index])
              : newBlackFallenPieces.push(squares[enPassantTarget.index]);
          }
        }
      }
      if (squares[dest].player) {
        squares[dest].player === 1
          ? newWhiteFallenPieces.push(squares[dest])
          : newBlackFallenPieces.push(squares[dest]);
      }
    }
    setSelectedIndex(-1);
    const theirKingIndex = getPieceIndex({
      player: getOpponentPlayerId(player),
      squares: newSquares,
      type: 'king'
    });
    if (
      checkerPos({
        squares: newSquares,
        kingIndex: theirKingIndex,
        player
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
      player: getOpponentPlayerId(player),
      squares: newSquares,
      enPassantTarget
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
        ? { index: dest, player: newSquares[dest].player }
        : {};
    setEnPassantTarget(target);
    setPlayer(getOpponentPlayerId(player));
    setTurn(turn === 'white' ? 'black' : 'white');
    return 'success';
  }
}
