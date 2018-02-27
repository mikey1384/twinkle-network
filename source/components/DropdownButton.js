import PropTypes from 'prop-types'
import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from './Button'
import DropdownList from 'components/DropdownList'

class DropdownButton extends Component {
  static propTypes = {
    icon: PropTypes.string,
    direction: PropTypes.string,
    listStyle: PropTypes.object,
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
      direction,
      opacity = 1,
      style,
      icon = 'pencil',
      listStyle = {},
      text = '',
      ...props
    } = this.props
    return (
      <div
        style={{
          ...style,
          opacity: menuDisplayed ? 1 : opacity,
          position: 'relative'
        }}
      >
        <Button
          {...props}
          onClick={() => this.setState({ menuDisplayed: !menuDisplayed })}
        >
          <span className={`glyphicon glyphicon-${icon}`} />
          {text && <span>&nbsp;&nbsp;</span>}
          <span>{text}</span>
        </Button>
        {menuDisplayed && (
          <DropdownList
            style={{ minWidth: '12rem', ...listStyle }}
            direction={direction}
          >
            {this.renderMenu()}
          </DropdownList>
        )}
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
          {prop.label}
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
