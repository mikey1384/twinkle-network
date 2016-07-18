import React from 'react';

export default function Contents(props) {
  return (
    <div id="contents" className="container-fluid">
      {props.children}
    </div>
  )
}
