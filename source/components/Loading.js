import React from 'react';

export default function Loading({text = '', style = {
  textAlign: 'center',
  paddingTop: '1em',
  paddingBottom: '1em',
  fontSize: '3em'
}}) {
  return (
    <p style={style}>
      <span className="glyphicon glyphicon-refresh spinning"></span>&nbsp;
      <span>{text}</span>
    </p>
  )
}
