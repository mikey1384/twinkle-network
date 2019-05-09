import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import getPiece from './helpers/piece';

FallenPieces.propTypes = {
  whiteFallenPieces: PropTypes.array,
  blackFallenPieces: PropTypes.array
};

export default function FallenPieces({ whiteFallenPieces, blackFallenPieces }) {
  const whiteFallenHash = {};
  const blackFallenHash = {};

  if (whiteFallenPieces) {
    for (let piece of whiteFallenPieces) {
      if (!whiteFallenHash[piece.type]) {
        whiteFallenHash[piece.type] = { ...piece, count: 1 };
      } else {
        whiteFallenHash[piece.type].count += 1;
      }
    }
  }

  if (blackFallenPieces) {
    for (let piece of blackFallenPieces) {
      if (!blackFallenHash[piece.type]) {
        blackFallenHash[piece.type] = { ...piece, count: 1 };
      } else {
        blackFallenHash[piece.type].count += 1;
      }
    }
  }

  const whiteFallenPiecesCompressed = Object.keys(whiteFallenHash).map(
    key => whiteFallenHash[key]
  );
  const blackFallenPiecesCompressed = Object.keys(blackFallenHash).map(
    key => blackFallenHash[key]
  );

  return (
    <div
      style={{
        height: '3rem',
        display: 'flex',
        flexDirection: 'column',
        margin: '1rem 0 1rem 0'
      }}
    >
      <div style={{ display: 'flex' }}>
        {whiteFallenPiecesCompressed.map((piece, index) => (
          <Square
            key={index}
            piece={getPiece(piece)}
            style={{ ...getPiece(piece).style, height: '3rem', width: '3rem' }}
            count={piece.count}
            player="white"
          />
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {blackFallenPiecesCompressed.map((piece, index) => (
          <Square
            key={index}
            piece={getPiece(piece)}
            style={{ ...getPiece(piece).style, height: '3rem', width: '3rem' }}
            count={piece.count}
            player="black"
          />
        ))}
      </div>
    </div>
  );
}
