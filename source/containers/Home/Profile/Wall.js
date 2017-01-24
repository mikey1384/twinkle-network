import React from 'react';

export default function Wall() {
  return (
    <div
      className="panel panel-default"
      style={{borderTop: '#e7e7e7 1px solid'}}
    >
      <div className="panel-body">
        <ul className="nav nav-tabs">
          <li className="active"><a>Front Page</a></li>
          <li><a>Guestbook</a></li>
        </ul>
      </div>
    </div>
  )
}
