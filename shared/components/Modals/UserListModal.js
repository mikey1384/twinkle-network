import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class UserListModal extends Component {
  render() {
    return (
      <Modal
        {...this.props}
        animation={false}
        bsSize="sm"
      >
        <Modal.Header closeButton>
          <h5>{this.props.title}</h5>
        </Modal.Header>
        <Modal.Body>
          <ul
            className="list-group"
            style={{marginBottom: '0px'}}
          >
            {
              this.renderList()
            }
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-default"
            onClick={ () => this.props.onHide() }
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderList() {
    const { likers } = this.props;
    const otherLikers = likers.filter(liker => {
      return (liker.userId == this.props.userId) ? false : true;
    })
    let likerArray = [];
    for (let i = 0; i < likers.length; i++) {
      if (likers[i].userId == this.props.userId) likerArray.push(likers[i])
    }
    return likerArray.concat(otherLikers).map(liker => {
      return (
        <li
          className="list-group-item"
          key={liker.userId}
        >{`${liker.username}${liker.userId == this.props.userId ? " (You)" : ""}`}
        </li>
      )
    })
  }
}
