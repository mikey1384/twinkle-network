import React, {Component} from 'react'

export default class LinkGroup extends Component {
  render() {
    return (
      <ul className="media-list">
        <li className="media">
          <div className="media-left">
            <a href="#">
              <img className="media-object" src="..." alt="..." />
            </a>
          </div>
          <div className="media-body">
            <h4 className="media-heading">Media heading</h4>
            ...
          </div>
        </li>
      </ul>
    )
  }
}

// <Embedly title="a sample url" url="https://www.youtube.com/" />
