import React from 'react';
import {Modal} from 'react-bootstrap';

export default function UserListModal(props) {
  const {users, userId, description = '', descriptionColor} = props;
  const otherUsers = users.filter(user => user.userId !== userId);
  let userArray = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId == userId) userArray.push(users[i])
  }
  return (
    <Modal
      style={props.style}
      show={props.show}
      onHide={props.onHide}
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
          {userArray.concat(otherUsers).map(user => {
              return (
                <li
                  className="list-group-item"
                  key={user.userId}
                >{user.username} <span style={{color: descriptionColor && descriptionColor}}>{description && description(user)}</span>
                </li>
              )
            })
          }
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
}
