import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'react-bootstrap'
import Button from 'components/Button'
import { connect } from 'react-redux'
import { Color } from 'constants/css'

UserListModal.propTypes = {
  description: PropTypes.string,
  descriptionShown: PropTypes.func,
  descriptionColor: PropTypes.string,
  onHide: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  userId: PropTypes.number,
  users: PropTypes.arrayOf(
    PropTypes.shape({ userId: PropTypes.number.isRequired })
  ).isRequired
}
function UserListModal({
  users,
  userId,
  description = '',
  descriptionColor = Color.green(),
  descriptionShown,
  onHide,
  style,
  title
}) {
  const otherUsers = users.filter(user => user.userId !== userId)
  let userArray = []
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId === userId) userArray.push(users[i])
  }
  return (
    <Modal show style={style} onHide={onHide} animation={false} bsSize="sm">
      <Modal.Header closeButton>
        <h5>{title}</h5>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group" style={{ marginBottom: '0px' }}>
          {userArray.concat(otherUsers).map(user => {
            let userStatusDisplayed =
              typeof descriptionShown === 'function'
                ? descriptionShown(user)
                : user.userId === userId
            return (
              <li className="list-group-item" key={user.userId}>
                {user.username}{' '}
                <span
                  style={{
                    color: descriptionColor,
                    fontWeight: 'bold'
                  }}
                >
                  {userStatusDisplayed && description}
                </span>
              </li>
            )
          })}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-default" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(UserListModal)
