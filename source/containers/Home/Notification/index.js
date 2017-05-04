import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchNotifications} from 'redux/actions/NotiActions'

@connect(
  state => ({
    notifications: state.NotiReducer.notifications
  }),
  {fetchNotifications}
)
export default class Notification extends Component {
  static propTypes = {
    notifications: PropTypes.array,
    fetchNotifications: PropTypes.func
  }

  componentDidMount() {
    const {fetchNotifications} = this.props
    fetchNotifications()
  }

  render() {
    const {notifications} = this.props
    return (
      <div
        className="well"
        style={{
          maxHeight: '300px',
          overflowY: 'scroll'
        }}
      >
        <h4
          style={{
            fontWeight: 'bold',
            marginTop: '0px',
            textAlign: 'center'
          }}
        >
          Notifications
        </h4>
        <ul
          className="list-group"
        >
          {notifications.length > 0 && notifications.map(notification => {
            return <li className="list-group-item" key={notification.id}>{notification.content}</li>
          })}
        </ul>
      </div>
    )
  }
}
