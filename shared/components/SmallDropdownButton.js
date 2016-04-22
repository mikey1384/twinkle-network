import React, { Component } from 'react';
import listensToClickOutside from 'react-onclickoutside/decorator';

class SmallDropdownButton extends Component {
  state = {
    menuDisplayed: false
  }
  handleClickOutside = (event) => {
    this.setState({menuDisplayed: false});
  }
  handleMenuClick(action) {
    action();
    this.setState({menuDisplayed: false});
  }
  renderMenu() {
    const { menuProps } = this.props;
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return (
          <li
            key={index}
            role="separator"
            className="divider"></li>
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
  render () {
    const { menuDisplayed } = this.state;
    const menuDisplay = menuDisplayed ? 'block' : 'none';
    return (
      <span
        className="dropdown pull-right"
        style={{
          position: 'absolute',
          right: this.props.rightMargin || '0px',
          marginRight: '2rem'
        }}>
        <button className="dropdown-toggle" onClick={ () => this.setState({menuDisplayed: !menuDisplayed})}>
          <span className="glyphicon glyphicon-pencil"></span>
        </button>
        <ul className="dropdown-menu"
          style={{
            cursor: 'pointer',
            display: menuDisplay
          }}
        >
          { this.renderMenu() }
        </ul>
      </span>
    )
  }
}

export default listensToClickOutside(SmallDropdownButton);
