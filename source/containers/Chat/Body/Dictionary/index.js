import React, { useRef } from 'react';
import Input from './Input';

export default function Dictionary() {
  const inputRef = useRef(null);
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
      <Input
        onHeightChange={() => console.log('height changing')}
        onSubmit={result => console.log(result)}
        innerRef={inputRef}
      />
    </div>
  );
}
