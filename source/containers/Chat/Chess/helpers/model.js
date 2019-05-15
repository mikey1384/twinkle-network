import getPiece from './piece';

export function initialiseChessBoard({ initialState, loading, myId }) {
  if (loading) return [];
  let myColor = 'white';
  const blackPieces = [
    { type: 'rook', color: 'black', isPiece: true },
    { type: 'knight', color: 'black', isPiece: true },
    { type: 'bishop', color: 'black', isPiece: true },
    { type: 'queen', color: 'black', isPiece: true },
    { type: 'king', color: 'black', isPiece: true },
    { type: 'bishop', color: 'black', isPiece: true },
    { type: 'knight', color: 'black', isPiece: true },
    { type: 'rook', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true },
    { type: 'pawn', color: 'black', isPiece: true }
  ];
  const whitePieces = [
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'pawn', color: 'white', isPiece: true },
    { type: 'rook', color: 'white', isPiece: true },
    { type: 'knight', color: 'white', isPiece: true },
    { type: 'bishop', color: 'white', isPiece: true },
    { type: 'queen', color: 'white', isPiece: true },
    { type: 'king', color: 'white', isPiece: true },
    { type: 'bishop', color: 'white', isPiece: true },
    { type: 'knight', color: 'white', isPiece: true },
    { type: 'rook', color: 'white', isPiece: true }
  ];
  let board;
  let defaultBoard = [...blackPieces, ...Array(32).fill({}), ...whitePieces];
  if (initialState) {
    let { board: parsedBoard, playerColors } = JSON.parse(initialState);
    board = parsedBoard;
    myColor = playerColors[myId];
    if (myColor === 'black') {
      board.reverse();
    }
  }
  return board || defaultBoard;
}

export function checkerPos({ squares, kingIndex, myColor }) {
  const result = [];
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i].color || squares[i].color === squares[kingIndex].color) {
      continue;
    }
    if (
      getPiece({ piece: squares[i], myColor }).isMovePossible({
        src: i,
        dest: kingIndex,
        isDestEnemyOccupied: true,
        color: squares[i].color,
        myColor
      }) &&
      isMoveLegal({
        srcToDestPath: getPiece({
          piece: squares[i],
          myColor
        }).getSrcToDestPath(i, kingIndex),
        squares
      })
    ) {
      result.push(i);
    }
  }
  return result;
}

export function getPieceIndex({ color, squares, type }) {
  let result = -1;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].type === type && squares[i].color === color) {
      result = i;
      break;
    }
  }
  return result;
}

export function getOpponentPlayerColor(color) {
  return color === 'white' ? 'black' : 'white';
}

export function getPlayerPieces({ color, squares }) {
  let kingIndex = -1;
  const playerPieces = squares.reduce((prev, curr, index) => {
    if (curr.color && curr.color === color) {
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
  color,
  squares,
  src,
  enPassantTarget,
  myColor
}) {
  return squares.map((square, index) =>
    index === src ||
    isPossibleAndLegal({
      src,
      dest: index,
      squares,
      enPassantTarget,
      myColor
    })
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

export function isGameOver({ squares, enPassantTarget, myColor }) {
  const { kingIndex, playerPieces } = getPlayerPieces({
    color: getOpponentPlayerColor(myColor),
    squares
  });
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
      myColor
    });
  }
  const possibleNextDest = nextDest.filter(
    dest =>
      dest >= 0 &&
      dest <= 63 &&
      isPossibleAndLegal({
        src: kingIndex,
        dest,
        squares,
        enPassantTarget,
        myColor
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
      myColor,
      squares
    });
    potentialKingSlayers = kingWillBeCapturedBy({
      kingIndex: dest,
      squares: newSquares,
      myColor
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
            squares,
            enPassantTarget,
            myColor
          })
        ) {
          return false;
        }
      }
    }
    const allBlockPoints = [];
    for (let checker of checkers) {
      const trajectory = getPiece({
        piece: squares[checker],
        myColor
      }).getSrcToDestPath(checker, kingIndex);
      if (trajectory.length === 0) return 'Checkmate';
      const blockPoints = [];
      for (let square of trajectory) {
        for (let piece of playerPieces) {
          if (
            piece.piece.type !== 'king' &&
            isPossibleAndLegal({
              src: piece.index,
              dest: square,
              squares,
              enPassantTarget,
              myColor
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
            squares,
            enPassantTarget,
            myColor
          })
        ) {
          const newSquares = returnBoardAfterMove({
            src: piece.index,
            dest: i,
            myColor,
            squares
          });
          if (
            kingWillBeCapturedBy({
              kingIndex: piece.piece.type === 'king' ? i : kingIndex,
              squares: newSquares,
              myColor
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
      (srcToDestPath[i] !== ignore && squares[srcToDestPath[i]].color)
    ) {
      return false;
    }
  }
  return true;
}

export function isPossibleAndLegal({
  src,
  dest,
  myColor,
  squares,
  enPassantTarget
}) {
  if (squares[dest].color === squares[src].color) {
    return false;
  }
  return (
    getPiece({ piece: squares[src], myColor }).isMovePossible({
      color: squares[src].color,
      src,
      dest,
      isDestEnemyOccupied: !!squares[dest].color,
      enPassantTarget,
      myColor
    }) &&
    isMoveLegal({
      srcToDestPath: getPiece({
        piece: squares[src],
        myColor
      }).getSrcToDestPath(src, dest),
      squares
    })
  );
}

export function kingWillBeCapturedBy({ kingIndex, squares, myColor }) {
  const checkerPositions = checkerPos({
    squares,
    kingIndex,
    myColor
  });
  return checkerPositions;
}

export function returnBoardAfterMove({
  squares,
  src,
  dest,
  enPassantTarget,
  myColor
}) {
  const srcRow = Math.floor(src / 8);
  const destRow = Math.floor(dest / 8);
  const destColumn = dest % 8;
  const attacking = srcRow - destRow === 1;
  const enPassanting =
    enPassantTarget &&
    enPassantTarget.color !== myColor &&
    attacking &&
    enPassantTarget.index % 8 === destColumn;
  const newSquares = squares.map((square, index) => {
    if (index === dest) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const lastRow = [56, 57, 58, 59, 60, 61, 62, 63];
      let transform = false;
      if (squares[src].type === 'pawn') {
        if (myColor === 'white' && firstRow.indexOf(index) !== -1) {
          transform = true;
        }
        if (myColor === 'black' && lastRow.indexOf(index) !== -1) {
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

export function getPositionId({ index, myColor }) {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  if (myColor === 'black') letters.reverse();
  console.log(letters);
  const row =
    myColor === 'black' ? 9 - Math.ceil(index / 8) : Math.ceil(index / 8);
  const column = letters[index % 8];
  return `${column + row}`;
}
