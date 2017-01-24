import React from 'react';
import Wall from './Wall';

export default function Body() {
  return (
    <div>
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <div className="panel-body">
          <ul className="nav nav-pills">
            <li className="active"><a>Front Page</a></li>
            <li><a>Posts</a></li>
            <li><a>Contents</a></li>
            <li><a>Likes</a></li>
          </ul>
        </div>
      </div>
      <Wall />
    </div>
  )
}
