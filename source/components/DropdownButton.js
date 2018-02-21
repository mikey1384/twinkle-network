import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from './Button'

class DropdownButton extends Component {
  static propTypes = {
    icon: PropTypes.string,
    menuProps: PropTypes.array.isRequired,
    opacity: PropTypes.number,
    style: PropTypes.object,
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
      opacity = 1,
      style,
      icon = 'pencil',
      text = ''
    } = this.props
    return (
      <div
        style={{
          ...style,
          opacity: menuDisplayed ? 1 : opacity
        }}
      >
        <Button
          onClick={() => this.setState({ menuDisplayed: !menuDisplayed })}
        >
          <span className={`glyphicon glyphicon-${icon}`} />
          {text && <span>&nbsp;&nbsp;</span>}
          <span>{text}</span>
        </Button>
        <ul
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
        return <li key={index} role="separator" />
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
