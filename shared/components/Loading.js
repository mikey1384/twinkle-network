import React from 'react';

export default function Loading({text}) {
  return (
    <p style={{
      textAlign: 'center',
      paddingTop: '1em',
      paddingBottom: '1em',
      fontSize: '3em'
    }}>
      <span className="glyphicon glyphicon-refresh spinning"></span>&nbsp;
      <span>{text}</span>
    </p>
  )
}
