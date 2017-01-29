import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import onClickOutside from 'react-onclickoutside'

class NotificationsButton extends Component {
  static propTypes = {
    onHideMenu: PropTypes.func,
    menuShown: PropTypes.bool,
    onClick: PropTypes.func,
    notifications: PropTypes.array
  }

  handleClickOutside = (event) => {
    this.setState({highlighted: false})
    this.props.onHideMenu()
  }

  constructor() {
    super()
    this.state = {
      highlighted: false
    }
  }

  render() {
    const {menuShown, onClick, notifications} = this.props
    const {highlighted} = this.state
    return (
      <li className="dropdown">
        <a
          className="dropdown-toggle unselectable"
          style={{
            cursor: 'pointer',
            color: highlighted ? '#333333' : null
          }}
          onClick={() => {
            this.setState({highlighted: true})
            onClick()
          }}
        >
          <span className="glyphicon glyphicon-bell"></span>&nbsp;&nbsp;Notifications&nbsp;
          <span
            className="badge"
            style={{backgroundColor: 'red'}}
            >2
          </span>
        </a>
        {menuShown &&
          <ul
            className="dropdown-menu"
            style={{
              width: '30em',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            {notifications.map(notification => (
              <li style={{width: '30em'}} key={notification.id}>
                <a style={{padding: '0px'}}>
                  <div style={{margin: '0 10px 0 10px', borderBottom: '1px solid #e7e7e7'}}>
                    <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                      <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                        {notification.message}
                      </span>
                      <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
            <li style={{textAlign: 'center', borderTop: '1px solid #e7e7e7'}}>
              <Link
                to="/notifications"
                style={{padding: '0.5em 0 0.5em 0'}}
                onClick={() => this.handleClickOutside()}
              >See All</Link>
            </li>
          </ul>
        }
      </li>
    )
  }
}

export default onClickOutside(NotificationsButton)
