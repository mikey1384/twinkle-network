import React, {Component} from 'react';

export default class UsernameText extends Component {
  constructor() {
    super()
    this.state = {
      menuShown: false
    }
  }

  render() {
    const {menuShown} = this.state;
    return (
      <span
        className="dropdown"
        onMouseLeave={() => this.setState({menuShown: false})}
      >
        <strong
          style={{cursor: 'pointer'}}
          onMouseEnter={() => this.setState({menuShown: true})}
        >{this.props.user.name}</strong>
        {menuShown &&
          <ul className="dropdown-menu"
            style={{
              position: 'absolute',
              marginTop: '0px',
              cursor: 'pointer',
              display: 'block'
            }}
          >
            <li>
              <a
                onClick={() => console.log(this.props.user.id)}
              >
                Message
              </a>
            </li>
          </ul>
        }
      </span>
    )
  }
}
