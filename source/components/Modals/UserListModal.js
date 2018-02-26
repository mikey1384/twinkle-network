import PropTypes from 'prop-types'
import React from 'react'
import Modal from 'components/Modal'
import Button from 'components/Button'
import RoundList from 'components/RoundList'
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
    <Modal onHide={onHide}>
      <div className="modal-heading"><span>{title}</span></div>
      <div className="modal-body">
        <RoundList>
          {userArray.concat(otherUsers).map(user => {
            let userStatusDisplayed =
              typeof descriptionShown === 'function'
                ? descriptionShown(user)
                : user.userId === userId
            return (
              <li key={user.userId}>
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
        </RoundList>
      </div>
      <div className="modal-footer">
        <Button onClick={onHide}>Close</Button>
      </div>
    </Modal>
  )
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(UserListModal)
