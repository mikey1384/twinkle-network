import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from './Button'

class DropdownButton extends Component {
  static propTypes = {
    alignLeft: PropTypes.bool,
    icon: PropTypes.string,
    menuProps: PropTypes.array.isRequired,
    opacity: PropTypes.number,
    style: PropTypes.object,
    shape: PropTypes.string,
    size: PropTypes.string,
    text: PropTypes.string
  }

  handleClickOutside = event => {
    this.setState({ menuDisplayed: false })
  }

  constructor() {
    super()
    this.state = {
      menuDisplayed: false
    }
  }

  render() {
    const { menuDisplayed } = this.state
    const {
      alignLeft,
      opacity = 1,
      style,
      shape,
      size,
      icon = 'pencil',
      text = ''
    } = this.props
    const buttonShape =
      shape === 'button'
        ? `btn ${size ? `btn-${size} ` : ''}btn-default`
        : 'dropdown-toggle'
    return (
      <div
        className={`dropdown ${!alignLeft && 'pull-right'}`}
        style={{
          ...style,
          opacity: menuDisplayed ? 1 : opacity
        }}
      >
        <Button
          className={buttonShape}
          onClick={() => this.setState({ menuDisplayed: !menuDisplayed })}
        >
          <span className={`glyphicon glyphicon-${icon}`} />
          {text && <span>&nbsp;&nbsp;</span>}
          <span>{text}</span>
        </Button>
        <ul
          className="dropdown-menu"
          style={{
            cursor: 'pointer',
            display: menuDisplayed ? 'block' : 'none'
          }}
        >
          {this.renderMenu()}
        </ul>
      </div>
    )
  }

  renderMenu() {
    const { menuProps } = this.props
    return menuProps.map((prop, index) => {
      if (prop.separator) {
        return <li key={index} role="separator" className="divider" />
      }
      return (
        <li onClick={() => this.handleMenuClick(prop.onClick)} key={index}>
          <a>{prop.label}</a>
        </li>
      )
    })
  }

  handleMenuClick(action) {
    action()
    this.setState({ menuDisplayed: false })
  }
}

export default onClickOutside(DropdownButton)
