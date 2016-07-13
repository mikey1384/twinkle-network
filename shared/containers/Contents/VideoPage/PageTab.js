import React from 'react';

export default function PageTab(props) {
  return (
    <div className="row container-fluid">
      <ul className="nav nav-tabs nav-justified" style={{width: '100%'}}>
        <li
          className={props.watchTabActive && 'active'}
          style={{cursor: 'pointer'}}
          onClick={props.onWatchTabClick}
        >
          <a>Watch</a>
        </li>
        <li
          className={!props.watchTabActive && 'active'}
          style={{cursor: 'pointer'}}
          onClick={props.onQuestionTabClick}
        >
          <a>Questions {props.questions.length > 0 && `(${props.questions.length})`}</a>
        </li>
      </ul>
    </div>
  )
}
