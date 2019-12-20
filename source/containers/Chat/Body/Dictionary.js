import React from 'react';

export default function Dictionary() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          border: '1px solid blue',
          width: '100%',
          height: 'CALC(100% - 10rem)'
        }}
      ></div>
      <div
        style={{ border: '1px solid pink', width: '100%', height: '10rem' }}
      ></div>
    </div>
  );
}
