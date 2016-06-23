import React, {Component} from 'react';
import onClickOutside from 'react-onclickoutside';

class SmallDropdownButton extends Component {
  handleClickOutside = event => {
    this.setState({menuDisplayed: false});
  }
  
  constructor() {
    super()
    this.state = {
      menuDisplayed: false
    }
  }

  render () {
    const {menuDisplayed} = this.state;
    const menuDisplay = menuDisplayed ? 'block' : 'none';
    return (
      <span
        className="dropdown pull-right"
        style={{
          position: 'absolute',
          right: this.props.rightMargin || '0px',
          marginRight: '2rem',
          zIndex: '1'
        }}>
        <button className="dropdown-toggle" onClick={() => this.setState({menuDisplayed: !menuDisplayed})}>
          <span className="glyphicon glyphicon-pencil"></span>
        </button>
        <ul className="dropdown-menu"
          style={{
            cursor: 'pointer',
            display: menuDisplay
          }}
        >
          {this.renderMenu()}
        </ul>
      </span>
    )
  }

  renderMenu() {
    const {menuProps} = this.props;
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return (
          <li
            key={index}
            role="separator"
            className="divider"
          />
        )
      }
      return (
        <li
          onClick={() => this.handleMenuClick(prop.onClick)}
          key={index}
        >
          <a>{prop.label}</a>
        </li>
      )
    })
  }

  handleMenuClick(action) {
    action();
    this.setState({menuDisplayed: false});
  }
}

export default onClickOutside(SmallDropdownButton)
