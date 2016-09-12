import React, {Component, PropTypes} from 'react';
import {NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

export default class Notifications extends Component {
  render() {
    return (
      <li className="dropdown">
        <a
          className="dropdown-toggle"
          style={{cursor: 'pointer'}}
        >
          <span className="glyphicon glyphicon-bell"></span>&nbsp;&nbsp;Notifications&nbsp;
          <span
            className="badge"
            style={{backgroundColor: 'red'}}
            >2
          </span>
        </a>
        <ul
          className="dropdown-menu"
          style={{
            width: '30em',
            cursor: 'pointer',
            display: 'block'
          }}
        >
          <li>
            <a>
              Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
            </a>
          </li>
          <li>
            <a>
              Katie reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
            </a>
          </li>
          <li>
            <a>
              Judy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
            </a>
          </li>
        </ul>
      </li>
    )
  }
}
