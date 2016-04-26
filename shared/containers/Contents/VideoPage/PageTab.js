import React, { Component } from 'react';

export default class PageTab extends Component {
  render() {
    return (
      <div className="row container-fluid">
        <ul className="nav nav-tabs nav-justified" style={{width: '100%'}}>
          <li
            className={this.props.watchTabActive ? 'active' : ''}
            style={{cursor: 'pointer'}}
            onClick={this.props.onWatchTabClick}
          >
            <a>Watch</a>
          </li>
          <li
            className={this.props.watchTabActive ? '' : 'active'}
            style={{cursor: 'pointer'}}
            onClick={this.props.onQuestionTabClick}
          >
            <a>Questions</a>
          </li>
        </ul>
      </div>
    )
  }
}
