import React, {Component, PropTypes} from 'react';
import {NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {Link} from 'react-router';

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
          <li style={{width: '30em'}}>
            <a style={{padding: '0px'}}>
              <div style={{margin: '0 10px 0 10px', borderBottom: '1px solid #e7e7e7'}}>
                <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                  <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                    Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
                  </span>
                  <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>1 hour ago</p>
                </div>
              </div>
            </a>
          </li>
          <li style={{width: '30em'}}>
            <a style={{padding: '0px'}}>
              <div style={{margin: '0 10px 0 10px', borderBottom: '1px solid #e7e7e7'}}>
                <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                  <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                    Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
                  </span>
                  <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>1 hour ago</p>
                </div>
              </div>
            </a>
          </li>
          <li style={{width: '30em'}}>
            <a style={{padding: '0px'}}>
              <div style={{margin: '0 10px 0 10px', borderBottom: null}}>
                <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                  <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                    Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
                  </span>
                  <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>1 hour ago</p>
                </div>
              </div>
            </a>
          </li>
          <li style={{textAlign: 'center', borderTop: '1px solid #e7e7e7'}}>
            <Link to="/notifications" style={{padding: '0.5em 0 0.5em 0'}}>See All</Link>
          </li>
        </ul>
      </li>
    )
  }
}
