import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import {connect} from 'react-redux'
import {Color} from 'constants/css'

@connect(
  state => ({
    userId: state.UserReducer.userId
  })
)
export default class UserListModal extends Component {
  static propTypes = {
    users: PropTypes.array,
    userId: PropTypes.number,
    descriptionShown: PropTypes.func,
    description: PropTypes.string,
    descriptionColor: PropTypes.string,
    style: PropTypes.object,
    onHide: PropTypes.func,
    title: PropTypes.string
  }

  render() {
    const {users, userId, description = '', descriptionColor, descriptionShown} = this.props
    const otherUsers = users.filter(user => user.userId !== userId)
    let userArray = []
    for (let i = 0; i < users.length; i++) {
      if (users[i].userId === userId) userArray.push(users[i])
    }
    return (
      <Modal
        show
        style={this.props.style}
        onHide={this.props.onHide}
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
            {userArray.concat(otherUsers).map(user => {
              let userStatusDisplayed = typeof descriptionShown === 'function' ?
                descriptionShown(user) : user.userId === userId
              return (
                <li
                  className="list-group-item"
                  key={user.userId}
                >{user.username} <span
                    style={{
                      color: descriptionColor || Color.green,
                      fontWeight: 'bold'
                    }}
                  >{userStatusDisplayed && description}</span>
                </li>
              )
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-default"
            onClick={() => this.props.onHide()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
