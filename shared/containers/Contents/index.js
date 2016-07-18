import React, {Component} from 'react';

export default class Contents extends Component {
  render() {
    return (
      <div id="contents" className="container-fluid">
        {this.props.children}
      </div>
    )
  }
}
