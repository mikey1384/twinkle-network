export default function getPiece({
  piece: { type, color },
  myColor,
  interactable
}) {
  const initialPawnPositions = {
    [myColor]: [48, 49, 50, 51, 52, 53, 54, 55],
    [myColor === 'white' ? 'black' : 'white']: [8, 9, 10, 11, 12, 13, 14, 15]
  };
  if (!color) return {};
  switch (type) {
    case 'pawn':
      return {
        img: {
          style: {
            cursor: color === myColor && interactable ? 'pointer' : '',
            position: 'absolute'
          },
          src:
            color === 'white'
              ? 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg'
              : 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
        },
        isMovePossible({
          src,
          dest,
          isDestEnemyOccupied,
          enPassantTarget,
          color,
          myColor
        }) {
          const srcRow = Math.floor(src / 8);
          const srcColumn = src % 8;
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          const oneSquareModifier = color === myColor ? -8 : 8;
          const twoSquaresModifier = color === myColor ? -16 : 16;
          const destCrossable = color
            ? color === myColor
              ? srcRow - destRow === 1
              : destRow - srcRow === 1
            : false;
          let attackable = isDestEnemyOccupied && destCrossable;
          const enPassantPossible =
            enPassantTarget &&
            enPassantTarget.color &&
            enPassantTarget.color !== myColor &&
            destCrossable &&
            destColumn === enPassantTarget.index % 8 &&
            srcRow === Math.floor(enPassantTarget.index / 8) &&
            Math.abs(srcColumn - (enPassantTarget.index % 8)) === 1;
          if (
            (dest === src + oneSquareModifier ||
              (dest === src + twoSquaresModifier &&
                initialPawnPositions[color].indexOf(src) !== -1)) &&
            !isDestEnemyOccupied
          ) {
            return true;
          } else if (attackable && Math.abs(srcColumn - destColumn) === 1) {
            return true;
          } else if (enPassantPossible) {
            return true;
          }
          return false;
        },
        getSrcToDestPath(src, dest) {
          const srcRow = Math.floor(src / 8);
          const destRow = Math.floor(dest / 8);
          const result = [];
          if (srcRow + 2 === destRow) {
            result.push(src + 8);
          }
          if (srcRow - 2 === destRow) {
            result.push(src - 8);
          }
          return result;
        }
      };

    case 'bishop':
      return {
        img: {
          style: {
            cursor: color === myColor && interactable ? 'pointer' : '',
            position: 'absolute'
          },
          src:
            color === 'white'
              ? 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg'
              : 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg'
        },
        isMovePossible({ src, dest }) {
          const srcRow = Math.floor(src / 8);
          const srcColumn = src % 8;
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          return (
            Math.abs(srcRow - destRow) === Math.abs(srcColumn - destColumn)
          );
        },
        getSrcToDestPath(src, dest) {
          let path = [];
          let pathStart;
          let pathEnd;
          let incrementBy;
          if (src > dest) {
            pathStart = dest;
            pathEnd = src;
          } else {
            pathStart = src;
            pathEnd = dest;
          }
          if (Math.abs(src - dest) % 9 === 0) {
            incrementBy = 9;
            pathStart += 9;
          } else {
            incrementBy = 7;
            pathStart += 7;
          }

          for (let i = pathStart; i < pathEnd; i += incrementBy) {
            path.push(i);
          }
          return path;
        }
      };

    case 'knight':
      return {
        img: {
          style: {
            cursor: color === myColor && interactable ? 'pointer' : '',
            position: 'absolute'
          },
          src:
            color === 'white'
              ? 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg'
              : 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg'
        },
        isMovePossible({ src, dest }) {
          const srcRow = Math.floor(src / 8);
          const srcColumn = src % 8;
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          return (
            (srcRow + 2 === destRow && srcColumn - 1 === destColumn) ||
            (srcRow + 2 === destRow && srcColumn + 1 === destColumn) ||
            (srcRow + 1 === destRow && srcColumn - 2 === destColumn) ||
            (srcRow + 1 === destRow && srcColumn + 2 === destColumn) ||
            (srcRow - 2 === destRow && srcColumn - 1 === destColumn) ||
            (srcRow - 2 === destRow && srcColumn + 1 === destColumn) ||
            (srcRow - 1 === destRow && srcColumn - 2 === destColumn) ||
            (srcRow - 1 === destRow && srcColumn + 2 === destColumn)
          );
        },
        getSrcToDestPath() {
          return [];
        }
      };

    case 'rook':
      return {
        img: {
          style: {
            cursor: color === myColor && interactable ? 'pointer' : '',
            position: 'absolute'
          },
          src:
            color === 'white'
              ? 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg'
              : 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg'
        },
        isMovePossible({ src, dest }) {
          const srcRow = Math.floor(src / 8);
          const srcColumn = src % 8;
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;
          return srcRow === destRow || srcColumn === destColumn;
        },
        getSrcToDestPath(src, dest) {
          let path = [];
          let pathStart;
          let pathEnd;
          let incrementBy;
          if (src > dest) {
            pathStart = dest;
            pathEnd = src;
          } else {
            pathStart = src;
            pathEnd = dest;
          }
          if (Math.abs(src - dest) % 8 === 0) {
            incrementBy = 8;
            pathStart += 8;
          } else {
            incrementBy = 1;
            pathStart += 1;
          }

          for (let i = pathStart; i < pathEnd; i += incrementBy) {
            path.push(i);
          }
          return path;
        }
      };

    case 'queen':
      return {
        img: {
          style: {
            cursor: color === myColor && interactable ? 'pointer' : '',
            position: 'absolute'
          },
          src:
            color === 'white'
              ? 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg'
              : 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg'
        },
        isMovePossible({ src, dest }) {
          const srcRow = Math.floor(src / 8);
          const srcColumn = src % 8;
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;

          return (
            Math.abs(srcRow - destRow) === Math.abs(srcColumn - destColumn) ||
            srcRow === destRow ||
            srcColumn === destColumn
          );
        },
        getSrcToDestPath(src, dest) {
          let path = [];
          let pathStart;
          let pathEnd;
          let incrementBy;
          if (src > dest) {
            pathStart = dest;
            pathEnd = src;
          } else {
            pathStart = src;
            pathEnd = dest;
          }
          if (Math.abs(src - dest) % 8 === 0) {
            incrementBy = 8;
            pathStart += 8;
          } else if (Math.abs(src - dest) % 9 === 0) {
            incrementBy = 9;
            pathStart += 9;
          } else if (Math.abs(src - dest) % 7 === 0) {
            incrementBy = 7;
            pathStart += 7;
          } else {
            incrementBy = 1;
            pathStart += 1;
          }
          for (let i = pathStart; i < pathEnd; i += incrementBy) {
            path.push(i);
          }
          return path;
        }
      };

    case 'king':
      return {
        img: {
          style: {
            cursor: color === myColor && interactable ? 'pointer' : '',
            position: 'absolute'
          },
          src:
            color === 'white'
              ? 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg'
              : 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
        },
        isMovePossible({ src, dest }) {
          const srcRow = Math.floor(src / 8);
          const srcColumn = src % 8;
          const destRow = Math.floor(dest / 8);
          const destColumn = dest % 8;

          return (
            (Math.abs(srcRow - destRow) === Math.abs(srcColumn - destColumn) ||
              srcRow === destRow ||
              srcColumn === destColumn) &&
            (Math.abs(srcRow - destRow) === 1 ||
              Math.abs(srcColumn - destColumn) === 1)
          );
        },
        getSrcToDestPath(src, dest) {
          return [];
        }
      };

    default:
      return {};
  }
}
