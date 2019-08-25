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
    let { board: parsedBoard, playerColors, move } = JSON.parse(initialState);
    board = parsedBoard;
    if (typeof move?.srcIndex === 'number') {
      board[myColor === 'black' ? 63 - move.srcIndex : move.srcIndex] =
        move.piece;
    }
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
      getPiece({ piece: squares[i], myColor })?.isMovePossible({
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
  squares,
  src,
  enPassantTarget,
  myColor
}) {
  const actualSquares = squares.map(square => (square.isPiece ? square : {}));
  return actualSquares.map((square, index) =>
    index === src ||
    isPossibleAndLegal({
      src,
      dest: index,
      squares: actualSquares,
      enPassantTarget,
      myColor
    })
      ? {
          ...square,
          state: ['check', 'checkmate'].includes(square.state)
            ? square.state
            : 'highlighted'
        }
      : {
          ...square,
          state: ['check', 'checkmate'].includes(square.state)
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
  const whitePieces = squares
    .map((square, index) => ({ ...square, index }))
    .filter(square => square.color === 'white' && !!square.isPiece);
  const remainingWhitePiece = whitePieces.filter(
    piece => piece.type !== 'king'
  )[0];
  const blackPieces = squares
    .map((square, index) => ({ ...square, index }))
    .filter(square => square.color === 'black' && !!square.isPiece);
  const remainingBlackPiece = blackPieces.filter(
    piece => piece.type !== 'king'
  )[0];
  if (whitePieces.length === 1 && blackPieces.length === 1) return 'Draw';
  if (whitePieces.length === 2 && blackPieces.length === 1) {
    if (
      remainingWhitePiece?.type === 'bishop' ||
      remainingWhitePiece?.type === 'knight'
    ) {
      return 'Draw';
    }
  }
  if (blackPieces.length === 2 && whitePieces.length === 1) {
    if (
      remainingBlackPiece?.type === 'bishop' ||
      remainingBlackPiece?.type === 'knight'
    ) {
      return 'Draw';
    }
  }

  if (blackPieces.length === 2 && whitePieces.length === 2) {
    if (
      remainingWhitePiece?.type === 'bishop' &&
      remainingBlackPiece?.type === 'bishop'
    ) {
      const { index: whiteBishopIndex } = remainingWhitePiece;
      const { index: blackBishopIndex } = remainingBlackPiece;

      const whiteBishopRow = Math.floor(whiteBishopIndex / 8);
      const whiteBishopRowIsEven = whiteBishopRow % 2 === 0;
      const whiteBishopColumn = whiteBishopIndex % 8;
      const whiteBishopColumnIsEven = whiteBishopColumn % 2 === 0;
      const blackBishopRow = Math.floor(blackBishopIndex / 8);
      const blackBishopRowIsEven = blackBishopRow % 2 === 0;
      const blackBishopColumn = blackBishopIndex % 8;
      const blackBishopColumnIsEven = blackBishopColumn % 2 === 0;

      const whiteBishopIsOnShadedSquare =
        whiteBishopRowIsEven === whiteBishopColumnIsEven;
      const blackBishopIsOnShadedSquare =
        blackBishopRowIsEven === blackBishopColumnIsEven;

      if (whiteBishopIsOnShadedSquare === blackBishopIsOnShadedSquare) {
        return 'Draw';
      }
    }
  }

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
  for (let dest of possibleNextDest) {
    const newSquares = returnBoardAfterMove({
      src: kingIndex,
      dest,
      myColor,
      squares
    });
    const potentialKingSlayers = kingWillBeCapturedBy({
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
          const newSquares = returnBoardAfterMove({
            src: piece.index,
            dest: checkers[0],
            myColor,
            squares
          });
          const potentialKingSlayers = kingWillBeCapturedBy({
            kingIndex,
            squares: newSquares,
            myColor
          });
          if (potentialKingSlayers.length === 0) {
            return false;
          }
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
            if (!blockPoints.includes(square)) blockPoints.push(square);
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
        if (!allBlockPoints[j].includes(allBlockPoints[0][i])) {
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

export function isMoveLegal({ srcToDestPath, squares }) {
  for (let i = 0; i < srcToDestPath.length; i++) {
    if (squares[srcToDestPath[i]].isPiece) {
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
    getPiece({ piece: squares[src], myColor })?.isMovePossible({
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
  kingEndDest,
  isCastling
}) {
  const srcColumn = src % 8;
  const destColumn = dest % 8;
  const destRow = Math.floor(dest / 8);
  const enPassantTargetRow = Math.floor(enPassantTarget / 8);
  const enPassantTargetColumn = enPassantTarget % 8;
  const attacking =
    Math.abs(srcColumn - destColumn) === 1 &&
    destColumn === enPassantTargetColumn &&
    destRow === enPassantTargetRow - 1;
  const enPassanting =
    enPassantTarget && attacking && squares[src].type === 'pawn';
  const newSquares = squares.map((square, index) => {
    if (index === dest) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      let transform = false;
      if (squares[src].type === 'pawn' && firstRow.includes(index)) {
        transform = true;
      }
      return {
        ...squares[src],
        state: 'arrived',
        type: transform ? 'queen' : squares[src].type
      };
    }
    if (index === src) return {};
    if (enPassanting && index === enPassantTarget) return {};
    return {
      ...square,
      state: isCastling && index === kingEndDest ? 'arrived' : ''
    };
  });
  return newSquares;
}

export function getPositionId({ index, myColor }) {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  if (myColor === 'black') letters.reverse();
  const row =
    myColor === 'black' ? Math.floor(index / 8) + 1 : 8 - Math.floor(index / 8);
  const column = letters[index % 8];
  return `${column + row}`;
}
