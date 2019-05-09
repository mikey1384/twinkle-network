import getPiece from './piece';

export function initialiseChessBoard() {
  return [
    { type: 'rook', player: 2 },
    { type: 'knight', player: 2 },
    { type: 'bishop', player: 2 },
    { type: 'queen', player: 2 },
    { type: 'king', player: 2 },
    { type: 'bishop', player: 2 },
    { type: 'knight', player: 2 },
    { type: 'rook', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    { type: 'pawn', player: 2 },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'pawn', player: 1 },
    { type: 'rook', player: 1 },
    { type: 'knight', player: 1 },
    { type: 'bishop', player: 1 },
    { type: 'queen', player: 1 },
    { type: 'king', player: 1 },
    { type: 'bishop', player: 1 },
    { type: 'knight', player: 1 },
    { type: 'rook', player: 1 }
  ];
}

export function checkerPos({ squares, kingIndex, player }) {
  const result = [];
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i].player || squares[i].player !== player) {
      continue;
    }
    if (
      getPiece(squares[i]).isMovePossible({
        src: i,
        dest: kingIndex,
        isDestEnemyOccupied: true
      }) &&
      isMoveLegal({
        srcToDestPath: getPiece(squares[i]).getSrcToDestPath(i, kingIndex),
        squares
      })
    ) {
      result.push(i);
    }
  }
  return result;
}

export function getPieceIndex({ player, squares, type }) {
  let result = -1;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].type === type && squares[i].player === player) {
      result = i;
      break;
    }
  }
  return result;
}

export function getOpponentPlayerId(player) {
  return player === 1 ? 2 : 1;
}

export function getPlayerPieces({ player, squares }) {
  let kingIndex = -1;
  const playerPieces = squares.reduce((prev, curr, index) => {
    if (curr.player && curr.player === player) {
      if (curr.type === 'king') {
        kingIndex = index;
        return [{ piece: curr, index }].concat(prev);
      }
      return prev.concat({ piece: curr, index });
    }
    return prev;
  }, []);
  return { kingIndex, playerPieces };
}

export function highlightPossiblePathsFromSrc({
  player,
  squares,
  src,
  enPassantTarget
}) {
  return squares.map((square, index) =>
    index === src ||
    isPossibleAndLegal({ src, dest: index, squares, player, enPassantTarget })
      ? {
          ...square,
          state:
            ['check', 'checkmate'].indexOf(square.state) !== -1
              ? square.state
              : 'highlighted'
        }
      : {
          ...square,
          state:
            ['check', 'checkmate'].indexOf(square.state) !== -1
              ? square.state
              : ''
        }
  );
}

export function isGameOver({ player, squares, enPassantTarget }) {
  const { kingIndex, playerPieces } = getPlayerPieces({ player, squares });
  let isChecked = false;
  const nextDest = [
    kingIndex - 1,
    kingIndex + 1,
    kingIndex - 7,
    kingIndex - 8,
    kingIndex - 9,
    kingIndex + 7,
    kingIndex + 8,
    kingIndex + 9
  ];
  let checkers = [];
  const kingPiece = squares[kingIndex];
  if (kingPiece.state === 'check') {
    isChecked = true;
    checkers = checkerPos({
      squares,
      kingIndex,
      player: getOpponentPlayerId(player)
    });
  }
  const possibleNextDest = nextDest.filter(
    dest =>
      dest >= 0 &&
      dest <= 63 &&
      isPossibleAndLegal({
        src: kingIndex,
        dest,
        player,
        squares,
        enPassantTarget
      })
  );
  if (possibleNextDest.length === 0 && kingPiece.state !== 'check') {
    return false;
  }
  let kingCanMove = false;
  let potentialKingSlayers = [];
  for (let dest of possibleNextDest) {
    const newSquares = returnBoardAfterMove({
      src: kingIndex,
      dest,
      player,
      squares
    });
    potentialKingSlayers = kingWillBeCapturedBy({
      kingIndex: dest,
      player,
      squares: newSquares
    });
    if (potentialKingSlayers.length === 0) {
      kingCanMove = true;
    }
  }
  if (kingCanMove) return false;
  if (isChecked) {
    if (checkers.length === 1) {
      for (let piece of playerPieces) {
        if (
          piece.piece.type !== 'king' &&
          isPossibleAndLegal({
            src: piece.index,
            dest: checkers[0],
            player,
            squares,
            enPassantTarget
          })
        ) {
          return false;
        }
      }
    }
    const allBlockPoints = [];
    for (let checker of checkers) {
      const trajectory = getPiece(squares[checker]).getSrcToDestPath(
        checker,
        kingIndex
      );
      if (trajectory.length === 0) return 'Checkmate';
      const blockPoints = [];
      for (let square of trajectory) {
        for (let piece of playerPieces) {
          if (
            piece.piece.type !== 'king' &&
            isPossibleAndLegal({
              src: piece.index,
              dest: square,
              player,
              squares,
              enPassantTarget
            })
          ) {
            if (checkers.length === 1) return false;
            if (blockPoints.indexOf(square) === -1) blockPoints.push(square);
          }
        }
      }
      if (blockPoints.length === 0) return 'Checkmate';
      allBlockPoints.push(blockPoints);
    }
    if (allBlockPoints.length === 1) return false;
    for (let i = 0; i < allBlockPoints[0].length; i++) {
      let blockable = true;
      for (let j = 0; j < allBlockPoints.length; j++) {
        if (allBlockPoints[j].indexOf(allBlockPoints[0][i]) === -1) {
          blockable = false;
          break;
        }
      }
      if (blockable) return false;
    }
    return 'Checkmate';
  } else {
    for (let i = 0; i < squares.length; i++) {
      for (let piece of playerPieces) {
        if (
          isPossibleAndLegal({
            src: piece.index,
            dest: i,
            player,
            squares,
            enPassantTarget
          })
        ) {
          const newSquares = returnBoardAfterMove({
            src: piece.index,
            dest: i,
            player,
            squares
          });
          if (
            kingWillBeCapturedBy({
              kingIndex: piece.piece.type === 'king' ? i : kingIndex,
              player,
              squares: newSquares
            }).length === 0
          ) {
            return false;
          }
        }
      }
    }
  }
  return 'Stalemate';
}

export function isMoveLegal({ srcToDestPath, ignore, include, squares }) {
  for (let i = 0; i < srcToDestPath.length; i++) {
    if (
      srcToDestPath[i] === include ||
      (srcToDestPath[i] !== ignore && squares[srcToDestPath[i]].player)
    ) {
      return false;
    }
  }
  return true;
}

export function isPossibleAndLegal({
  src,
  dest,
  player,
  squares,
  enPassantTarget
}) {
  if (squares[dest].player === player) {
    return false;
  }
  return (
    getPiece(squares[src]).isMovePossible({
      src,
      dest,
      isDestEnemyOccupied: !!squares[dest].player,
      enPassantTarget
    }) &&
    isMoveLegal({
      srcToDestPath: getPiece(squares[src]).getSrcToDestPath(src, dest),
      squares
    })
  );
}

export function kingWillBeCapturedBy({ kingIndex, player, squares }) {
  const checkerPositions = checkerPos({
    squares: squares,
    kingIndex,
    player: getOpponentPlayerId(player)
  });
  return checkerPositions;
}

export function returnBoardAfterMove({
  squares,
  src,
  dest,
  player,
  enPassantTarget
}) {
  const srcRow = Math.floor(src / 8);
  const destRow = Math.floor(dest / 8);
  const destColumn = dest % 8;
  const attacking =
    player === 1 ? srcRow - destRow === 1 : destRow - srcRow === 1;
  const enPassanting =
    enPassantTarget &&
    enPassantTarget.player !== player &&
    attacking &&
    enPassantTarget.index % 8 === destColumn;
  const newSquares = squares.map((square, index) => {
    if (index === dest) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const lastRow = [56, 57, 58, 59, 60, 61, 62, 63];
      let transform = false;
      if (squares[src].type === 'pawn') {
        if (player === 1 && firstRow.indexOf(index) !== -1) {
          transform = true;
        }
        if (player === 2 && lastRow.indexOf(index) !== -1) {
          transform = true;
        }
      }
      return {
        ...squares[src],
        state: '',
        type: transform ? 'queen' : squares[src].type
      };
    }
    if (index === src) return {};
    if (enPassanting && index === enPassantTarget.index) return {};
    return {
      ...square,
      state: ''
    };
  });
  return newSquares;
}
