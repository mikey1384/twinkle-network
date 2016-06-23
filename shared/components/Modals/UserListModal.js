import React from 'react';
import {Modal} from 'react-bootstrap';

export default function UserListModal(props) {
  return (
    <Modal
      {...props}
      animation={false}
      bsSize="sm"
    >
      <Modal.Header closeButton>
        <h5>{props.title}</h5>
      </Modal.Header>
      <Modal.Body>
        <ul
          className="list-group"
          style={{marginBottom: '0px'}}
        >
          {renderList()}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-default"
          onClick={() => props.onHide()}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )

  function renderList() {
    const { users, userId } = props;
    const otherUsers = users.filter(user => {
      return (user.userId == userId) ? false : true;
    })
    let userArray = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId == userId) userArray.push(users[i])
    }
    return userArray.concat(otherUsers).map(user => {
      return (
        <li
          className="list-group-item"
          key={user.userId}
        >{`${user.username}${user.userId == userId ? " (You)" : ""}`}
        </li>
      )
    })
  }
}
